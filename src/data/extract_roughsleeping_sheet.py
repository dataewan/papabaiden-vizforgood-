"""Extract data from the rough sleeping sheet."""

import pandas as pd
import xlrd
import os


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
    return book.sheets()


def getheader(sheet):
    """Return the table header from the sheet.

    :sheet: worksheet object
    :returns: list containing the header columns in the data table.

    """
    header = sheet.row(3)
    return [str(i.value) for i in header]


def getdata(bookname, sheet, header):
    """Get the data from the sheet

    :sheet: sheet object
    :header: list containing the header
    :returns: pandas dataframe containing the data
    """
    df = pd.read_excel(
        bookname,
        sheet.name,
        skiprows=15,
        header=None,
    )
    # make columns better to join on
    df.columns = [
        str(i).replace(' ', '').replace('/', '')
        for i in header
    ]

    return (
        df
        .drop(['', 'Missingdatacomment'], axis=1, errors='ignore')
        .dropna()
        .pipe(lambda x:
              x.assign(LocalAuthority=x.LocalAuthority.str.replace('2', ''))
              )
        .rename(columns={
            'LocalAuthority': 'LocalAuthorityName',
            'ONSCode': 'ONScode'
        })
    )


def processsheet(bookname, sheet):
    header = getheader(sheet)
    data = getdata(bookname, sheet, header)
    return data


if __name__ == "__main__":
    bookname = './data/downloaded/Rough_Sleeping_Autumn_2016_Final_Tables.xlsx'
    book = getbook(bookname)
    sheets = getsheets(book)
    for sheet in sheets:
        processed = processsheet(bookname, sheet)
        processed.to_csv(
            os.path.join(
                'data/extracted/',
                'roughsleeping_' + sheet.name + '.csv'
            ),
            index=False,
            encoding='utf-8'
        )
