import { jwtAxios } from "../utility/Utils"

const useService = () => {
    return {
        reviews: {
            updateStatus: (id, data) => jwtAxios.put(`/admin/comment/update/status/${id}`, data),
            store: data => jwtAxios.post('/admin/comment', data),
            fetchList: data => jwtAxios.post('/admin/comment/list', data),
            delete: id => jwtAxios.delete(`/admin/comment/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/admin/comment/update/${id}`, data)
        },
        blog: {
            fetchAll: () => jwtAxios.post('/admin/article/all'),
            fetchArticles: data => jwtAxios.post('/admin/article/list', data),
            get: data => jwtAxios.post('/admin/article/get', data),
            delete: id => jwtAxios.delete(`/admin/article/delete/${id}`),
            reviews: {
                store: data => jwtAxios.post('/admin/article/comment', data),
                fetchList: data => jwtAxios.post('/admin/article/comment/list', data),
                delete: id => jwtAxios.delete(`/admin/article/comment/delete/${id}`),
                update: (id, data) => jwtAxios.put(`/admin/article/comment/update/${id}`, data),
                updateStatus: (id, data) => jwtAxios.put(`/admin/article/comment/update/status/${id}`, data)
            },
            categories: {
                fetchAll: () => jwtAxios.post('/admin/article/category/all')
            },
            store: data => jwtAxios.post('/admin/article/store', data),
            update: (id, data) => jwtAxios.put(`/admin/article/update/${id}`, data),
            updateStatus: (id, data) => jwtAxios.put(`/admin/article/update/status/${id}`, data)
        },
        uploader: {
            tags: {
                fetchAll: () => jwtAxios.post('/admin/uploader/tags'),
                store: data => jwtAxios.post('/admin/uploader/tags/create', data)
            },
            save: (id, data) => jwtAxios.put(`/admin/uploader/save/${id}`, data),
            fetchList: data => jwtAxios.post('/admin/uploader', data),
            upload: data => jwtAxios.post('/admin/uploader/upload', data, {
                headers: {
                  'content-type': 'multipart/form-data'
                }
            })
        },
        dashboard: {
            fetchStatistics: () => jwtAxios.post('/admin/statistics')
        },
        validator: {
            checkUnique: data => jwtAxios.post('/admin/validator/unique', data)
        },
        orders: {
            fetchList: data => jwtAxios.post('/admin/order/list', data)
        },
        articleCategories: {
            store: data => jwtAxios.post('/admin/article/category', data),
            fetchAll: () => jwtAxios.post('/admin/article/category/list'),
            fetchList: () => jwtAxios.post('/admin/article/category/list'),
            delete: id => jwtAxios.delete(`/admin/article/category/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/admin/article/category/update/${id}`, data)
        },
        newsletter: {
            fetchList: data => jwtAxios.post('/admin/newsletter/list', data),
            delete: id => jwtAxios.delete(`/admin/newsletter/delete/${id}`),
            updateStatus: (id, data) => jwtAxios.put(`/admin/newsletter/update/status/${id}`, data)
        },
        messages: {
            store: data => jwtAxios.post('/admin/message', data),
            storeChat: data => jwtAxios.post('/admin/message/chat/store', data),
            fetchList: data => jwtAxios.post('/admin/message/list', data),
            fetchAll: () => jwtAxios.post('/admin/message/all'),
            fetchChats: data => jwtAxios.post('/admin/message/chats', data),
            delete: id => jwtAxios.delete(`/admin/message/delete/${id}`),
            updateStatus: (id, data) => jwtAxios.put(`/admin/message/update/status/${id}`, data)
        },
        adverts: {
            fetchAll: () => jwtAxios.post('/admin/advert/all'),
            fetchList: data => jwtAxios.post('/admin/advert/list', data),
            delete: id => jwtAxios.delete(`/admin/advert/delete/${id}`),
            store: data => jwtAxios.post('/admin/advert/create', data),
            update: (id, data) => jwtAxios.put(`/admin/advert/${id}`, data),
            get: id => jwtAxios.post('/admin/advert/get', {_id: id}),
            updateStatus: (id, data) => jwtAxios.put(`/admin/advert/update/status/${id}`, data)
        },
        operators: {
            fetchAll: () => jwtAxios.post('/admin/operator/all'),
            fetchList: data => jwtAxios.post('/admin/operator/list', data),
            delete: id => jwtAxios.delete(`/admin/operator/delete/${id}`),
            store: data => jwtAxios.post('/admin/operator/create', data),
            update: (id, data) => jwtAxios.post(`/admin/operator/update`, {
                _id: id,
                ...data
            }),
            get: id => jwtAxios.post('/admin/operator/get', {_id: id}),
            updateStatus: (id, data) => jwtAxios.post(`/admin/operator/update/status`, {
                _id: id,
                ...data
            })
        },
        users: {
            who: () => jwtAxios.get(`/admin/user/who`),
            updateFields: (id, data) => jwtAxios.put(`/admin/users/update/fields/${id}`, {
                fields: data
            }),
            updatePassword: (lastPassword, newPassword) => jwtAxios.post(`/admin/user/password/change`, {
                lastPassword,
                newPassword
            }),
            fetchAll: () => jwtAxios.post('/admin/user/all'),
            fetchList: data => jwtAxios.post('/admin/user/list', data),
            delete: id => jwtAxios.delete(`/admin/user/delete/${id}`),
            store: data => jwtAxios.post('/admin/user/create', data),
            update: (id, data) => jwtAxios.post(`/admin/user/update`, {
                _id: id,
                ...data
            }),
            get: id => jwtAxios.post('/admin/user/get', {_id: id}),
            updateStatus: (id, data) => jwtAxios.post(`/admin/user/update/status`, {
                _id: id,
                ...data
            })
        },
        advisors: {
            fetchAll: () => jwtAxios.post('/admin/advisor/all'),
            fetchList: data => jwtAxios.post('/admin/advisor/list', data),
            delete: id => jwtAxios.delete(`/admin/advisor/delete/${id}`),
            store: data => jwtAxios.post('/admin/advisor/create', data),
            update: (id, data) => jwtAxios.post(`/admin/advisor/update`, {
                _id: id,
                ...data
            }),
            get: id => jwtAxios.post('/admin/advisor/get', {_id: id}),
            updateStatus: (id, data) => jwtAxios.post(`/admin/advisor/update/status`, {
                _id: id,
                ...data
            })
        },
        creators: {
            fetchAll: () => jwtAxios.post('/admin/creator/all'),
            fetchList: data => jwtAxios.post('/admin/creator/list', data),
            delete: id => jwtAxios.delete(`/admin/creator/delete/${id}`),
            store: data => jwtAxios.post('/admin/creator/create', data),
            update: (id, data) => jwtAxios.post(`/admin/creator/update`, {
                _id: id,
                ...data
            }),
            get: id => jwtAxios.post('/admin/creator/get', {_id: id}),
            updateStatus: (id, data) => jwtAxios.post(`/admin/creator/update/status`, {
                _id: id,
                ...data
            })
        },
        transactions: {
            fetchAll: () => jwtAxios.post('/admin/transaction/all'),
            fetchList: data => jwtAxios.post('/admin/transaction/list', data),
            delete: id => jwtAxios.delete(`/admin/transaction/delete/${id}`),
            get: id => jwtAxios.post('/admin/transaction/get', {_id: id})
        },
        faq: {
            fetchAll: () => jwtAxios.post('/admin/faq/all'),
            fetchList: data => jwtAxios.post('/admin/faq/list', data),
            delete: id => jwtAxios.delete(`/admin/faq/delete/${id}`),
            store: data => jwtAxios.post('/admin/faq/create', data),
            update: (id, data) => jwtAxios.post(`/admin/faq/update`, {
                _id: id,
                ...data
            }),
            get: id => jwtAxios.post('/admin/faq/get', {_id: id}),
            updateStatus: (id, data) => jwtAxios.post(`/admin/faq/update/status`, {
                _id: id,
                ...data
            })
        },
        faqtopic: {
            fetchAll: () => jwtAxios.post('/admin/faqtopic/all'),
            fetchList: data => jwtAxios.post('/admin/faqtopic/list', data),
            delete: id => jwtAxios.delete(`/admin/faqtopic/delete/${id}`),
            store: data => jwtAxios.post('/admin/faqtopic/create', data),
            update: (id, data) => jwtAxios.post(`/admin/faqtopic/update`, {
                _id: id,
                ...data
            }),
            get: id => jwtAxios.post('/admin/faqtopic/get', {_id: id}),
            updateStatus: (id, data) => jwtAxios.post(`/admin/faqtopic/update/status`, {
                _id: id,
                ...data
            })
        },
        contactus: {
            fetchList: data => jwtAxios.post('/admin/contact/list', data),
            delete: id => jwtAxios.delete(`/admin/contact/delete/${id}`)
        },
        setting: {
            getByGroup: group => jwtAxios.post('/admin/setting/group', {group}),
            getByGroupAndKey: (group, key) => jwtAxios.post('/admin/setting/group/key', {group, key}),
            store: (group, key, value) => jwtAxios.post('/admin/setting/store', {
                group,
                key,
                value
            }),
            storeMultiple: (group, values) => jwtAxios.post('/admin/setting/store/multiple', {
                group,
                values
            })
        },
        tarrifs: {
            fetchAll: () => jwtAxios.post('/admin/tarrif/all'),
            fetchList: data => jwtAxios.post('/admin/tarrif/list', data),
            delete: id => jwtAxios.delete(`/admin/tarrif/delete/${id}`),
            store: data => jwtAxios.post('/admin/tarrif/create', data),
            update: (id, data) => jwtAxios.post(`/admin/tarrif/update`, {
                _id: id,
                ...data
            }),
            get: id => jwtAxios.post('/admin/tarrif/get', {_id: id}),
            updateStatus: (id, data) => jwtAxios.post(`/admin/tarrif/update/status`, {
                _id: id,
                ...data
            })
        }
    }
}

export default useService