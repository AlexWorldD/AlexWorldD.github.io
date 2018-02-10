import pandas as pd
import math
from pathos.multiprocessing import ProcessingPool as Pool
import json
import numpy as np
from tqdm import tqdm, tqdm_pandas, trange


def _apply_df(args):
    df, func, num, kwargs = args
    return num, df.apply(func, **kwargs)


def apply_by_multiprocessing(df, func, **kwargs):
    """
    Parallel execution function for the DataFrame
    :param df: Input DataFrame
    :param func:
    :param kwargs: additional arguments for the df.apply() such as axis and et al.
    :return: Output DataFrame
    """
    workers = kwargs.pop('workers')
    pool = Pool(processes=workers)
    result = pool.map(_apply_df, [(d, func, i, kwargs) for i, d in enumerate(np.array_split(df, workers))])
    pool.close()
    result = sorted(result, key=lambda x: x[0])
    return pd.concat([i[1] for i in result])


# Sandbox for tiny dataset
required_fields = ['followers_count',
                   'has_photo',
                   'personal',
                   'relation',
                   'space_groups',
                   'universities']
gids = {
    '47256091': 'SpaceLive',  # Открытый космос
    '40379': 'O_Cosmose',  # Греческий космос
    '30315369': 'Ros_Cosmos',  # Роскосмос
    '129636704': 'V_Cosmose',
    '32593073': 'DelMe'}
def_names = {
    'SpaceLive': None,  # Открытый космос
    'O_Cosmose': None,  # Греческий космос
    'Ros_Cosmos': None,  # Роскосмос
    'V_Cosmose': None,
    'DelMe': None}

personal = {'political': None,
            'langs': None,
            'religion': None,
            'people_main': None,
            'life_main': None,
            'smoking': None,
            'alcohol': None}
relation = {
    0: 'unknown',
    1: 'single',
    2: 'relationship',
    3: 'engaged',
    4: 'married',
    5: 'complecated',
    6: 'searching',
    7: 'in love'}
political_views = {1: 'Communist',
                   2: 'Socialist',
                   3: 'Moderate',
                   4: 'Liberal',
                   5: 'Conservative',
                   6: 'Monarchist',
                   7: 'Ultraconservative',
                   8: 'Apathetic',
                   9: 'Libertian'}
people_main = {
    1: 'intellect',
    2: 'kindness',
    3: 'health',
    4: 'wealth',
    5: 'courage',
    6: 'humour'}
life_main = {
    1: 'family',
    2: 'career',
    3: 'entertainment',
    4: 'science',
    5: 'improving_world',
    6: 'personal_dev',
    7: 'art',
    8: 'fame'
}
smoking = {
    1: 'very_negative',
    2: 'negative',
    3: 'neutral',
    4: 'compromised',
    5: 'positive'}

uni = {
    'Uni': None,
    'Status': None
}
main_lang = ['Русский', 'English', 'Українська', 'Deutsch', 'Español', 'Français']
unpack_fields = ['relation', 'Uni', 'Status', 'followers_count',
                 'political',
                 'English', 'Русский', 'Українська', 'Deutsch', 'Español', 'Français',
                 'religion',
                 'people_main',
                 'life_main',
                 'smoking',
                 'alcohol', ]


def unpack_groups(values):
    if values is None or type(values) is float:
        return pd.Series(def_names)
    return pd.Series({gids[x]: 1 for x in values})


def unpack_personal(values):
    if values is None or type(values) is float:
        return pd.Series(personal)
    else:
        res = personal.copy()
        for title in values:
            if title == 'political':
                if values[title] in political_views:
                    res[title] = political_views[values[title]]
            if title == 'smoking' or title == 'alcohol':
                res[title] = smoking[values[title]]
            if title == 'people_main':
                res[title] = people_main[values[title]]
            if title == 'life_main':
                res[title] = life_main[values[title]]
            if title == 'langs':
                for lan in values[title]:
                    if lan in main_lang:
                        res[lan] = 1
        return pd.Series(res)


# 77276

def unpack_uni(values):
    if values is None or type(values) is float:
        return pd.Series(uni)
    else:
        res = uni.copy()
        year = 0
        for item in values:
            if 'graduation' in item.keys() and item['graduation'] > year and 'education_status' in item.keys():
                year = item['graduation']
                res['Uni'] = item['name']
                res['Status'] = item['education_status']
        return pd.Series(res)


def unpack_followers(value):
    if value is None or (type(value) is float and math.isnan(value)) or value < 100:
        return 'Normal'
    elif value < 100:
        return 'Popular'
    elif value < 5000:
        return 'Very Popular'
    else:
        return 'Star'


def unpack_data(path='tiny.json'):
    data = pd.read_json(path)[required_fields]
    # Unpack groups:
    tqdm.pandas(desc="Unpack groups names")
    new_data = pd.concat([data, data.pop("space_groups").progress_apply(unpack_groups)], axis=1)
    # Unpack personal info
    # tqdm.pandas(desc="Unpack personal info")
    # new_data = pd.concat([data, data.pop("personal").progress_apply(unpack_personal),
    #                       data.pop("universities").progress_apply(unpack_uni),
    #                       data.pop("followers_count").progress_apply(unpack_followers)], axis=1)
    # Step by step
    tqdm.pandas(desc="Unpack personal info")
    new_data = pd.concat([new_data, new_data.pop("personal").progress_apply(unpack_personal)], axis=1)
    tqdm.pandas(desc="Unpack Uni info")
    new_data = pd.concat([new_data, new_data.pop("universities").progress_apply(unpack_uni)], axis=1)
    tqdm.pandas(desc="Unpack followers stat")
    new_data["followers_count"] = new_data["followers_count"].progress_apply(unpack_followers)
    # -----------------------
    # PARALLEL Version
    # tqdm.pandas(desc="Unpack groups names")
    # new_data = pd.concat([data, apply_by_multiprocessing(data.pop("space_groups"), unpack_groups, workers=6)], axis=1)
    # # Unpack personal info
    # tqdm.pandas(desc="Unpack personal info")
    # new_data = pd.concat([new_data, apply_by_multiprocessing(new_data.pop("personal"), unpack_personal, workers=6)], axis=1)
    # tqdm.pandas(desc="Unpack Uni info")
    # new_data = pd.concat([new_data, apply_by_multiprocessing(new_data.pop("universities"), unpack_uni, workers=6)],
    #                      axis=1)
    # tqdm.pandas(desc="Unpack followers stat")
    # new_data = pd.concat([new_data, apply_by_multiprocessing(new_data.pop("followers_count"), unpack_followers, workers=6)],
    #                      axis=1)
    # -----------------------
    tqdm.pandas(desc="Unpack relations")
    new_data['relation'] = new_data['relation'].progress_apply(
        lambda x: None if math.isnan(x) or x not in relation else relation[x])
    # new_data.drop(['DelMe'], axis=1, inplace=True)
    return new_data


if __name__ == '__main__':
    RESULT = dict()
    groups_names = ['SpaceLive',  # Открытый космос
                    'O_Cosmose',  # Греческий космос
                    'Ros_Cosmos',  # Роскосмос
                    'V_Cosmose']
    # data = unpack_data(path='../data/Users_data/users_data.json')
    # data.to_json('BIG.json', orient='records', force_ascii=False)
    data = pd.read_json('BIG.json', orient='records')
    for group in tqdm(groups_names):
        print('Work with data for', group)
        tmp_data = data[data[group].notnull()]
        res = dict()
        res['Size'] = tmp_data.shape[0]
        for title in unpack_fields:
            _tmp = tmp_data[title].value_counts(dropna=False).reset_index()
            if _tmp[_tmp[title] < 31].shape[0] != 0:
                _res = dict(_tmp[_tmp[title] > 30].values)
                _res['Other'] = _tmp[_tmp[title] < 31].shape[0]
            else:
                _res = dict(_tmp[_tmp[title] > 30].values)
            res[title] = _res
        others = groups_names.copy()
        others.remove(group)
        links = dict()
        for path in others:
            links[path] = tmp_data[tmp_data[path].notnull()].shape[0]
        res['Connections'] = links
        print('Success!')
        RESULT[group] = res
    print(RESULT)
    with open('AggregateDataBIG.json', 'w') as outfile:
        json.dump(RESULT, outfile, ensure_ascii=False)

# big_data = pd.read_json('../data/Users_data/users_data.json')[required_fields]
# print('t')
# data.to_json('tiny.json', orient='records', force_ascii=False)
# data['relation'].reset_index().value_counts()

# dict(new_data['political'].value_counts(dropna=False).reset_index().values)
