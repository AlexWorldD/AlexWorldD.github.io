import json
from collections import defaultdict

import vk_api

# Your private VK API token
from data_collecting.local_settings import token


gids = [
    '47256091',     # Открытый космос
    '40379',        # Греческий космос
    '30315369',     # Роскосмос
    '129636704',
    '32593073'
]

user_fields = [
    'verified',
    'sex',
    'bdate',
    'city',
    'country',
    'home_town',
    'has_photo',
    'education',
    'universities',
    'schools',
    'last_seen',
    'followers_count',
    'occupation',
    'personal',
    'relation',
]

vk_session = vk_api.VkApi(token=token)
vk = vk_session.get_api()


# Получение участников заданных групп
community_members_ids = defaultdict(list)
for gid in gids:
    print('Обрабатывается группа {}'.format(gid))
    offset = 0
    stop = False
    while not stop:
        print(offset)
        members_response = vk.groups.getMembers(group_id=gid, offset=offset)['items']
        if len(members_response) < 1000:
            stop = True
        for member_id in members_response:
            community_members_ids[member_id].append(gid)
        offset += 1000
        # if offset > 3000:
        #     break

with open('community_members_uids_{}.json'.format('-'.join(gids)), 'w') as f:
    json.dump(community_members_ids, f)


# Получение данных для участников заданных групп
def get_users_data(uids_batch):
    return vk.users.get(user_ids=','.join([str(m) for m in uids_batch]), name_case='nom', fields=','.join(user_fields))

users_data = []
uids_batch = []
uids_batch_length = 0
batch_number = 1
for uid in community_members_ids.keys():
    uids_batch.append(uid)
    uids_batch_length += 1
    if uids_batch_length == 1000:
        # сделать запрос
        print('Обрабатывается батч {}'.format(batch_number))
        users_data.extend(get_users_data(uids_batch))
        uids_batch = []
        uids_batch_length = 0
        batch_number += 1
else:
    # Получение данных для последнего (неполного) батча
    print('Обрабатывается последний батч')
    users_data.extend(get_users_data(uids_batch))


# Добавление в данные информации об участии в группах
for i in range(len(users_data)):
    uid = users_data[i].get('id')
    user_groups = community_members_ids.get(uid)
    users_data[i]['space_groups'] = user_groups

with open('users_data_{}.json'.format('-'.join(gids)), 'w') as f:
    json.dump(users_data, f)