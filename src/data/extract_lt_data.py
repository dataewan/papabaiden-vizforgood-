"""The data format in the worksheets isn't usable. Extract the data into flat
tables."""

import xlrd
import pandas as pd
import json
import os

with open('./lookup.json', 'r') as f:
    LOOKUP = json.load(f)


def getbook(bookname):
    """Get the book object.

    :bookname: string path of the workbook
    :returns: workbook object

    """
    return xlrd.open_workbook(bookname)


def getsheets(book):
    """Get the sheets that I want to extract data from.

    :book: workbook object
    :returns: object containing the sheets

    """
    return [
        i for i in book.sheets()
        # Don't include the notes sheet, as it is a different format
        if i.name != 'Notes'
    ]


def getheader(sheet):
    """Return the table header from the sheet.

    :sheet: worksheet object
    :returns: list containing the header columns in the data table.

    """
    header = sheet.row(5)
    return header


def parserow(row, rowindex, header):
    """Parse the row using logic in the worksheet

    :row: list object containing the row
    :rowindex: index of the row in the sheet
    :header: header list
    :returns: TODO

    """
    rowvalues = [c.value for c in row]
    rowtypes = [c.ctype for c in row]

    # the logic behind if the row is the one that I want or not
    # first of all, it has to be above row 11
    if rowindex < 10:
        return False

    # the next bit of logic is that we are only interested in rows where the
    # first column and the fifth column are empty. Rows not following this
    # pattern contain totals which should be discarded, we can always
    # recalculated a total.
    if rowtypes[0] != 0 and rowtypes[4] != 0:
        return False

    # we also want to make sure that there are values in columns B:D. These
    # values should be of ctype 1
    if not all([i == 1 for i in rowtypes[1:4]]):
        return False

    # okay, now I have a row that I want to work with. Put the header onto
    # these values to give me something I can make a dataframe with later.
    assert len(header) == len(row)
    nonempty_header = [
        v.value for i, v in enumerate(header)
        if rowvalues[i] != 0
    ]
    nonempty_values = [
        v for i, v in enumerate(rowvalues)
        if rowvalues[i] != 0
    ]

    parsed = dict(zip(nonempty_header, nonempty_values))
    LOCA = 'Local Authority Name'
    if LOCA in parsed:
        if parsed[LOCA] in LOOKUP:
            parsed[LOCA] = LOOKUP[parsed[LOCA]]
            # reset the ONS codes to null, we're removing these from the
            # dataset
            onscodes = [i for i in parsed.keys() if 'ONS' in str(i)]
            for field in onscodes:
                parsed[field] = None

    return parsed


def getdata(sheet, header):
    """Get the data from the workbook.

    :sheet: worksheet object
    :header: list containing the header

    """
    rows = []
    for i, row in enumerate(sheet.get_rows()):
        parsed = parserow(row, i, header)
        if parsed is not False:
            rows.append(parsed)

    return pd.DataFrame(rows)


def sortoutcolumns(df, dimensions):
    """Fix the column problems in the dataframe.
    """
    df.columns = df.columns.map(
        lambda x: (
            x
            .replace(' ', '')
            .replace('Old', '')
            .replace('DCLG', 'CLG')
        )
        if type(x) == str else x
    )

    columnstodrop = ['', 'CLGcode', 'NewONScode', 'ONScode']

    df_ = (
        df
        .pipe(lambda x: x.assign(LocalAuthorityName=x.LocalAuthorityName.str.replace('*', '')))
        .pipe(lambda x: x.assign(LocalAuthorityName=x.LocalAuthorityName.str.replace('UA', '')))
        .pipe(lambda x: x.assign(LocalAuthorityName=x.LocalAuthorityName.str.strip()))
    )

    ons_lookup = (
        df_
        [['LocalAuthorityName', 'NewONScode']]
        .pipe(lambda x: x.loc[~x.NewONScode.isnull()])
        .drop_duplicates()
        .rename(columns={'NewONScode': 'ONScode'})
    )

    return (
        df_
        .drop(columnstodrop, axis=1)
        .merge(ons_lookup,
               left_on='LocalAuthorityName',
               right_on='LocalAuthorityName',
               validate='m:1')
    )


def aggregate_localauthorities(df, dimensions):
    """There will be multiple rows with the same heading, and some of those
    rows have really horrible data in them (empty strings, ..., etc). Remove
    them and aggregate up the data.

    :df: messy df
    :dimensions: list of columns to group by
    :returns: cleaned dataframe
    """
    return (
        df
        .replace('..', 0)
        .set_index(dimensions)
        .apply(pd.to_numeric)
        .fillna(0.0)
        .reset_index()
        .groupby(dimensions, as_index=False)
        .agg(sum)
    )


def cleandata(df):
    """Tidy up the data, as there is a bit of a mess in it.

    1. There are local authorities that have been shifting around, aggregate up
        these rows
    1. There is some nasty formatting in the columns, which I'd like to remove.
    1. The column names are difficult to manipluate because they are
        inconsistently named.
    1. It is in wide format, which is harder to manipulate.

    Fix these and return

    :data: Pandas dataframe
    :returns: cleaned pandas dataframe

    """
    dimensions = ['LocalAuthorityName', 'ONScode']

    return (
        sortoutcolumns(df, dimensions=dimensions)
        .pipe(aggregate_localauthorities, dimensions=dimensions)
        .pipe(
            pd.melt,
            id_vars=dimensions,
            var_name='year',
            value_name='number'
        )
    )


def processsheet(sheet):
    header = getheader(sheet)
    data = getdata(sheet, header)
    cleaneddata = cleandata(data)

    return cleaneddata


if __name__ == "__main__":
    book = getbook('./data/downloaded/LT_615.xlsx')
    sheets = getsheets(book)
    for sheet in sheets:
        processed = processsheet(sheet)
        processed.to_csv(
            os.path.join(
                'data/extracted/',
                'LT_' + sheet.name + '.csv'
            ),
            index=False,
            encoding='utf-8'
        )
