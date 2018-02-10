import json
import codecs
import collections
import datetime

# with open('../data/Groups_Stat.json') as jsonfile:
RESULT = []
_tmp = []
data = json.load(codecs.open('../data/Groups_Stat.json', 'r', 'utf-8-sig'))
# data = [{'name': key, 'value': data[key]} for key in data]
for item in data:
    _t = {datetime.datetime.strptime(key, "%d.%m.%Y").date(): data[item][key] for key in data[item]}
    sort_arr = {k: _t[k] for k in sorted(_t)}
    _tmp.append([{'date': k, 'value': [item, sort_arr[k]]} for k in sort_arr])
for it in range(366):
    RESULT.append({'date': str(_tmp[0][it]['date']), 'value': {_tmp[0][it]['value'][0]: _tmp[0][it]['value'][1],
                                                          _tmp[1][it]['value'][0]: _tmp[1][it]['value'][1],
                                                          _tmp[2][it]['value'][0]: _tmp[2][it]['value'][1],
                                                          _tmp[3][it]['value'][0]: _tmp[3][it]['value'][1]}})
print('t')
with open('GroupData.json', 'w') as f:
    json.dump(RESULT, f, ensure_ascii=False)
