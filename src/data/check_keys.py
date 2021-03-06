"""Checks that there is consistency between the LT and roughsleeping sheets"""

import pandas as pd
import os
from glob import glob


def loaddata(datadir='./data/extracted/', lt_ix=0, rs_ix=0):
    """Loads two datafiles.
    :datadir: location of the datafiles
    :lt_ix: which lt file to return
    :rs_ix: which rs file to return
    :returns: tuple of 2 pandas dataframes

    """
    filenames = glob(os.path.join(datadir, '*.csv'))
    lt_files = [i for i in filenames if 'LT_' in i]
    rs_files = [i for i in filenames if 'roughsleeping_' in i]
    return (
        pd.read_csv(lt_files[lt_ix]),
        pd.read_csv(rs_files[rs_ix])
    )


def check(lt, rs):
    """Checks that there is consistency between the two sheets in terms of the
    keys contained in them.

    :lt: LT sheet, pandas dataframe object
    :rs: Roughsleeping sheet, pandas dataframe object

    There are a number of checks to perform:
    1. all the ONS codes in LT are present in RS
    2. all the ONS codes in RS are present in LT
    3. the names are consistent in between the two datasets: the same code
        should refer to the same name

    """
    # check the ONS codes from LT are also present in RS
    missingfromlt = lt.loc[~lt.ONScode.isin(rs.ONScode)]
    if len(missingfromlt) > 0:
        print('Codes that are in LT but not in RS')
        print(missingfromlt)

    # check the ONS codes from LT are also present in RS
    missingfromrs = rs.loc[~rs.ONScode.isin(lt.ONScode)]
    if len(missingfromrs) > 0:
        print('Codes that are in RS but not in LT')
        print(missingfromrs)

    # see that there is consistency between the naming
    columns = ['LocalAuthorityName', 'ONScode']
    inconsistent = (
        lt[columns]
        .drop_duplicates()
        .merge(
            rs[columns].drop_duplicates(),
            left_on='ONScode',
            right_on='ONScode'
        )
        .pipe(lambda x:
              x.query('LocalAuthorityName_x != LocalAuthorityName_y')
              )
    )
    if(len(inconsistent) > 0):
        print('Inconsistent names')
        print(inconsistent)


if __name__ == "__main__":
    lt, rs = loaddata()
    check(lt, rs)
