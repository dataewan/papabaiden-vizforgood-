"""Join our data, make a json file."""

import os
import glob
import pandas as pd
import json


def finddatasets(datadir):
    """Find all the datasets that I want to parse and join later.

    :datadir: directory containing the datasets
    :returns: object containing the relevant datasets

    """
    datasets = glob.glob(os.path.join(datadir, '*csv'))
    lt_datasets = [i for i in datasets if 'LT_' in i]
    rs_timeseries = os.path.join(datadir, 'roughsleeping_Table 1.csv')
    rs_demographics = os.path.join(datadir, 'roughsleeping_Table 2.csv')
    return {
        'lt_datasets': lt_datasets,
        'rs_timeseries': rs_timeseries,
        'rs_demographics': rs_demographics
    }


def parse_lt(datasetnames):
    """Parse all of the LT datasets, returning a joined dataset.

    :datasetnames: object containing the names of the datasets
    :returns: parsed dataframe

    """
    merged = None
    for lt_name in datasetnames['lt_datasets']:
        variablename = (
            os.path.basename(lt_name).replace('LT_', '')
            .replace('.csv', '')
        )
        df = (
            pd.read_csv(lt_name)
            .rename(columns={'number': variablename})
        )
        if merged is None:
            merged = df.copy()
        else:
            merged = (
                merged
                .merge(df,
                       how='outer',
                       on=['LocalAuthorityName', 'ONScode', 'year']
                       )
            )

    return merged


def parse_rs_ts(datasetnames):
    """Parse the timeseries part of the roughsleeping dataset.

    :datasetnames: object containing the names of the datasets.
    :returns: parsed dataframe

    """
    rs = pd.read_csv(datasetnames['rs_timeseries'])
    # there are a few columns to drop
    columnstodrop = [
        i for i in rs.columns
        if 'NumberofHouseholds' in i or 'RoughSleepingRate' in i
    ]
    return (
        rs
        .drop(columnstodrop, axis=1)
        .pipe(
            pd.melt,
            id_vars=['ONScode', 'LocalAuthorityName'],
            var_name='year',
            value_name='RoughSleepers'
        )
    )


def parse_demographcs(datasetnames):
    """Parse the demographics from the two roughsleeping files.

    :datasetnames: object containing the dataset names
    :returns:

    """
    ts = pd.read_csv(datasetnames['rs_timeseries'])
    dg = pd.read_csv(datasetnames['rs_demographics'])

    # extract the number of households from the timeseries file
    columns = [
        i for i in ts.columns
        if 'ONScode' in i or 'NumberofHouseholds' in i
    ]
    households = ts[columns]
    households.columns = ['ONScode', 'numhouseholds']
    households = (
        households
        .pipe(lambda x: x.assign(numhouseholds=x.numhouseholds * 1000))
        .pipe(lambda x: x.assign(numhouseholds=x.numhouseholds.astype(int)))
    )

    return (
        households
        .merge(
            dg.drop('LocalAuthorityName', axis=1),
            on='ONScode'
        )
    )


def merge_ts(lt_data, rs_data):
    """Merge together the timeseries data into one.

    :lt_data: dataframe containing the lt data
    :rs_data: TODO
    :returns: TODO

    """
    lt_data_ = (
        lt_data
        .pipe(lambda x: x.assign(year=pd.to_numeric(x.year).astype(int)))
    )
    rs_data_ = (
        rs_data
        .pipe(lambda x: x.assign(year=pd.to_numeric(x.year).astype(int)))
    )
    return lt_data_.merge(
        rs_data_, 
        on=['ONScode', 'year'],
        suffixes=['_LT', '_RS']
    )


def output_json(timeseries, demographics):
    """Create a merged dataset with one item for every district.

    :timeseries: timeseries dataframe
    :demographics: demographic dataframe

    """
    output = []
    for code in timeseries.ONScode.unique():
        ts = timeseries.query('ONScode == @code')
        dg = demographics.query('ONScode == @code')

        name = ts.LocalAuthorityName_LT.iloc[0]
        name_rs = ts.LocalAuthorityName_RS.iloc[0]

        # i don't like this bit. convert to json, and then convert the json
        # back to objects. It works.
        timedata_string = (
            ts
            .drop(['LocalAuthorityName_RS', 'LocalAuthorityName_LT',
                   'ONScode'], axis=1)
            .set_index('year')
            .to_json(orient='index')
        )
        timedata = json.loads(timedata_string)
        dems = json.loads(dg.iloc[0].to_json())
        output.append({
            'code': code,
            'data': {
                'timeseries': timedata,
                'demographics': dems
            }
        })

    with open('./data/processed/data.json', 'w') as f:
        f.write(json.dumps(output, indent=2))

if __name__ == "__main__":
    datasetnames = finddatasets('./data/extracted')
    lt_data = parse_lt(datasetnames)
    rs_timeseries = parse_rs_ts(datasetnames)
    demographics = parse_demographcs(datasetnames)
    timeseries = merge_ts(lt_data, rs_timeseries)

    output = output_json(timeseries, demographics)
