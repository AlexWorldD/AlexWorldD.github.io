import pandas as pd
import json
import xlrd
import codecs
import datetime
import simplejson

GroupNames = ['Space_Live',
              'O_Cosmose',
              'Ros_Cosmos',
              'V_Cosmose']
city2region = dict(pd.read_excel('../data/City2Region.xlsx').values);

def retro_dictify(frame):
    frame = frame.fillna('nan')
    d = dict()
    for row in frame.values:
        here = d
        for elem in row[:3]:
            if elem != 'nan':
                if elem not in here:
                    here[elem] = {}
                here = here[elem]
    for row in frame.values:
        if row[1] != 'nan' and row[2] != 'nan':
            d[row[0]][row[1]][row[2]] = row[-1]
        if row[1] != 'nan' and row[2] == 'nan':
            if row[0]=='cities':
                if row[1] in city2region:
                    if city2region[row[1]] not in d[row[0]]:
                        d[row[0]][city2region[row[1]]] = row[-1]
                    else:
                        d[row[0]][city2region[row[1]]] += row[-1]
                if row[1] in d[row[0]]:
                    d[row[0]].pop(row[1])
            else:
                d[row[0]][row[1]] = row[-1]
        if row[1] == 'nan' and row[2] == 'nan' and row[0] != 'countries':
            d[row[0]] = row[-1]
    return d


RESULT = dict()
FINAL = []
_tmp = []
for name in GroupNames:
    res = dict()
    data = pd.read_excel('../data/VK_data/' + name + '.xls')
    dates = data.groupby('Date')
    for date in dates:
        cur_date = date[1].drop(['Date'], axis=1)
        # res.append({'date': date[0], 'value': date[1].values.tolist()})
        # res[date[0]] = date[1].values.tolist()
        res[date[0]] = retro_dictify(cur_date)
        print('t')
    print('Done with ', name)
    RESULT[name] = res
# 03-12-16 -> 17-11-17
print('------------')
for item in RESULT:
    _t = {datetime.datetime.strptime(key, "%d.%m.%Y").date(): RESULT[item][key] for key in RESULT[item]}
    sort_arr = {k: _t[k] for k in sorted(_t)}
    new_sort = sort_arr.copy()
    for key in sort_arr:
        if key < datetime.date(2016, 12, 3) or key > datetime.date(2017, 11, 17):
            new_sort.pop(key)
    print('t')
    FINAL.append({'GroupName': item, 'stat': [{'date': str(k), 'value': new_sort[k]} for k in new_sort]})
    # _tmp.append([{'date': k, 'value': [item, sort_arr[k]]} for k in sort_arr])
print('t')
with open('../data/D1_v2.json', 'w') as f:
    f.write(simplejson.dumps(FINAL, ignore_nan=True, ensure_ascii=False))
CITY = {'Space_Live': {}, 'O_Cosmose': {}, 'Ros_Cosmos': {}, 'V_Cosmose': {}}
for it in range(len(FINAL[0]['stat'])):
    for key, item in FINAL[0]['stat'][it]['value']['cities'].items():
        if key not in CITY['Space_Live']:
            CITY['Space_Live'][key] = item
        else:
            CITY['Space_Live'][key] += item
    for key, item in FINAL[1]['stat'][it]['value']['cities'].items():
        if key not in CITY['O_Cosmose']:
            CITY['O_Cosmose'][key] = item
        else:
            CITY['O_Cosmose'][key] += item
    for key, item in FINAL[2]['stat'][it]['value']['cities'].items():
        if key not in CITY['Ros_Cosmos']:
            CITY['Ros_Cosmos'][key] = item
        else:
            CITY['Ros_Cosmos'][key] += item
    for key, item in FINAL[3]['stat'][it]['value']['cities'].items():
        if key not in CITY['V_Cosmose']:
            CITY['V_Cosmose'][key] = item
        else:
            CITY['V_Cosmose'][key] += item
R = dict()
for it in range(len(FINAL[0]['stat'])):
    R[str(FINAL[0]['stat'][it]['date'])]= [{'GroupName': FINAL[0]['GroupName'],
                       'Cities': FINAL[0]['stat'][it]['value']['cities']},
                       {'GroupName': FINAL[1]['GroupName'],
                        'Cities': FINAL[1]['stat'][it]['value']['cities']},
                       {'GroupName': FINAL[2]['GroupName'],
                        'Cities': FINAL[2]['stat'][it]['value']['cities']},
                       {'GroupName': FINAL[3]['GroupName'],
                        'Cities': FINAL[3]['stat'][it]['value']['cities']}
                       ]
MAP_R = {'total': [{'GroupName': key, 'stat': item} for key, item in CITY.items()],
         'daily': R}
with open('../data/Data4Map.json', 'w') as f:
    f.write(simplejson.dumps(MAP_R, ignore_nan=True, ensure_ascii=False))