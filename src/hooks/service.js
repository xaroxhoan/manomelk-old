import { jwtAxios } from "../utility/Utils"

const useService = () => {
    return {
        reviews: {
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/comment/update/status/${id}`, data),
            store: data => jwtAxios.post('/superAdmin/comment', data),
            fetchList: data => jwtAxios.post('/superAdmin/comment/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/comment/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/comment/update/${id}`, data)
        },
        attributes: {
            fetchList: data => jwtAxios.post('/superAdmin/attribute', data),
            fetchAll: () => jwtAxios.post('/superAdmin/attribute/all'),
            store: data => jwtAxios.post('/superAdmin/attribute/store', data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/attribute/update/status/${id}`, data),
            delete: id => jwtAxios.delete(`/superAdmin/attribute/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/attribute/update/${id}`, data)
        },
        menus: {
            get: id => jwtAxios.post('/superAdmin/menu/get', {_id: id}),
            fetchList: data => jwtAxios.post('/superAdmin/menu/list', data),
            fetchAllMainMenus: () => jwtAxios.post('/superAdmin/menu/mainmenu'),
            fetchAllSubMenuGroups: data => jwtAxios.post('/superAdmin/menu/submenugroup', data),
            store: data => jwtAxios.post('/superAdmin/menu', data),
            update: (id, data) => jwtAxios.put(`/superAdmin/menu/update/${id}`, data),
            delete: id => jwtAxios.delete(`/superAdmin/menu/delete/${id}`),
            swap: data => jwtAxios.post('/superAdmin/menu/order/swap', data)
        },
        blog: {
            fetchAll: () => jwtAxios.post('/superAdmin/article/all'),
            fetchArticles: data => jwtAxios.post('/superAdmin/article/list', data),
            get: data => jwtAxios.post('/superAdmin/article/get', data),
            delete: id => jwtAxios.delete(`/superAdmin/article/delete/${id}`),
            reviews: {
                store: data => jwtAxios.post('/superAdmin/article/comment', data),
                fetchList: data => jwtAxios.post('/superAdmin/article/comment/list', data),
                delete: id => jwtAxios.delete(`/superAdmin/article/comment/delete/${id}`),
                update: (id, data) => jwtAxios.put(`/superAdmin/article/comment/update/${id}`, data),
                updateStatus: (id, data) => jwtAxios.put(`/superAdmin/article/comment/update/status/${id}`, data)
            },
            categories: {
                fetchAll: () => jwtAxios.post('/superAdmin/article/category/all')
            },
            store: data => jwtAxios.post('/superAdmin/article/store', data),
            update: (id, data) => jwtAxios.put(`/superAdmin/article/update/${id}`, data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/article/update/status/${id}`, data)
        },
        users: {
            fetchAll: () => jwtAxios.post('/superAdmin/customer', { status: 'all' }),
            fetchCustomersAndAdmins: () => jwtAxios.post('/superAdmin/customer/admin'),
            storeSeller: data => jwtAxios.post('/superAdmin/seller', data),
            fetchAllSellers: data => jwtAxios.post('/superAdmin/customer/sellers', data),
            delete: id => jwtAxios.delete(`/superAdmin/users/delete/${id}`),
            updateSeller: (id, data) => jwtAxios.put(`/superAdmin/seller/update/${id}`, data),
            updateSellerStatus: (id, data) => jwtAxios.put(`/superAdmin/sellers/update/status/${id}`, data),
            fetchListUsers: data => jwtAxios.post('/superAdmin/users/list', data),
            fetchListCustomers: data => jwtAxios.post('/superAdmin/users/list', data),
            storeUser: data => jwtAxios.post('/superAdmin/users/store', data),
            updateUser: (id, data) => jwtAxios.put(`/superAdmin/users/update/${id}`, data),
            who: () => jwtAxios.get(`/share/who`),
            updateFields: (id, data) => jwtAxios.put(`/superAdmin/users/update/fields/${id}`, {
                fields: data
            }),
            updatePassword: (lastPassword, newPassword) => jwtAxios.post(`/superAdmin/users/password/change`, {
                lastPassword,
                newPassword
            })
        },
        brands: {
            store: data => jwtAxios.post('/superAdmin/brand', data),
            fetchList: data => jwtAxios.post('/superAdmin/brand/list', data),
            fetchAll: () => jwtAxios.post('/superAdmin/brand/all'),
            delete: id => jwtAxios.delete(`/superAdmin/brand/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/brand/update/${id}`, data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/brand/update/status/${id}`, data)
        },
        categories: {
            store: data => jwtAxios.post('/superAdmin/category', data),
            fetchAll: () => jwtAxios.post('/superAdmin/category/all'),
            fetchList: () => jwtAxios.post('/superAdmin/category/list'),
            delete: id => jwtAxios.delete(`/superAdmin/category/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/category/update/${id}`, data),
            swap: data => jwtAxios.post('/superAdmin/category/order/swap', data)
        },
        products: {
            fetchAll: () => jwtAxios.post('/superAdmin/product/all'),
            fetchList: data => jwtAxios.post('/superAdmin/product', data),
            delete: id => jwtAxios.delete(`/superAdmin/product/delete/${id}`),
            store: data => jwtAxios.post('/superAdmin/product/create', data),
            update: (id, data) => jwtAxios.put(`/superAdmin/product/${id}`, data),
            get: id => jwtAxios.post('/superAdmin/product/get', {_id: id}),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/product/update/status/${id}`, data)
        },
        linkedProducts: {
            store: data => jwtAxios.post('/superAdmin/linked-product', data),
            fetchList: data => jwtAxios.post('/superAdmin/linked-product/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/linked-product/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/linked-product/update/${id}`, data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/linked-product/update/status/${id}`, data)
        },
        coupons: {
            store: data => jwtAxios.post('/superAdmin/coupon/store', data),
            fetchList: data => jwtAxios.post('/superAdmin/coupon/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/coupon/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/coupon/update/${id}`, data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/coupon/update/status/${id}`, data)
        },
        discounts: {
            store: data => jwtAxios.post('/superAdmin/discount/store', data),
            fetchList: data => jwtAxios.post('/superAdmin/discount/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/discount/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/discount/update/${id}`, data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/discount/update/status/${id}`, data)
        },
        uploader: {
            tags: {
                fetchAll: () => jwtAxios.post('/superAdmin/uploader/tags'),
                store: data => jwtAxios.post('/superAdmin/uploader/tags/create', data)
            },
            save: (id, data) => jwtAxios.put(`/superAdmin/uploader/save/${id}`, data),
            fetchList: data => jwtAxios.post('/superAdmin/uploader', data),
            upload: data => jwtAxios.post('/superAdmin/uploader/upload', data, {
                headers: {
                  'content-type': 'multipart/form-data'
                }
            })
        },
        dashboard: {
            fetchStatistics: () => jwtAxios.post('/superAdmin/statistics')
        },
        validator: {
            checkUnique: data => jwtAxios.post('/superAdmin/validator/unique', data)
        },
        orders: {
            fetchList: data => jwtAxios.post('/superAdmin/order/list', data)
        },
        homeSlider: {
            store: data => jwtAxios.post('/superAdmin/homeslider', data),
            fetchList: data => jwtAxios.post('/superAdmin/homeslider/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/homeslider/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/homeslider/update/${id}`, data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/homeslider/update/status/${id}`, data)
        },
        articleCategories: {
            store: data => jwtAxios.post('/superAdmin/article/category', data),
            fetchAll: () => jwtAxios.post('/superAdmin/article/category/list'),
            fetchList: () => jwtAxios.post('/superAdmin/article/category/list'),
            delete: id => jwtAxios.delete(`/superAdmin/article/category/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/article/category/update/${id}`, data)
        },
        newsletter: {
            fetchList: data => jwtAxios.post('/superAdmin/newsletter/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/newsletter/delete/${id}`),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/newsletter/update/status/${id}`, data)
        },
        contactus: {
            fetchList: data => jwtAxios.post('/superAdmin/contactus/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/contactus/delete/${id}`)
        },
        faq: {
            store: data => jwtAxios.post('/superAdmin/faq', data),
            fetchList: data => jwtAxios.post('/superAdmin/faq/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/faq/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/faq/update/${id}`, data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/faq/update/status/${id}`, data)
        },
        faqtopic: {
            store: data => jwtAxios.post('/superAdmin/faqtopic', data),
            fetchAll: data => jwtAxios.post('/superAdmin/faqtopic/all', data),
            fetchList: data => jwtAxios.post('/superAdmin/faqtopic/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/faqtopic/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/faqtopic/update/${id}`, data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/faqtopic/update/status/${id}`, data)
        },
        customsearch: {
            store: data => jwtAxios.post('/superAdmin/customsearch/store', data),
            fetchList: data => jwtAxios.post('/superAdmin/customsearch/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/customsearch/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/customsearch/update/${id}`, data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/customsearch/update/status/${id}`, data)
        },
        setting: {
            getByGroup: group => jwtAxios.get(`/superAdmin/setting/${group}`),
            getByGroupAndKey: (group, key) => jwtAxios.get(`/superAdmin/setting/${group}/${key}`),
            store: (group, key, value) => jwtAxios.post('/superAdmin/setting/store', {
                group,
                key,
                value
            }),
            storeMultiple: (group, values) => jwtAxios.post('/superAdmin/setting/store/multiple', {
                group,
                values
            })
        },
        messages: {
            store: data => jwtAxios.post('/superAdmin/message', data),
            storeChat: data => jwtAxios.post('/superAdmin/message/chat/store', data),
            fetchList: data => jwtAxios.post('/superAdmin/message/list', data),
            fetchAll: () => jwtAxios.post('/superAdmin/message/all'),
            fetchChats: data => jwtAxios.post('/superAdmin/message/chats', data),
            delete: id => jwtAxios.delete(`/superAdmin/message/delete/${id}`),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/message/update/status/${id}`, data)
        },
        wallet: {
            byUser: data => jwtAxios.post('/superAdmin/wallet/byuser', data)
        },
        settlements: {
            store: data => jwtAxios.post('/superAdmin/settlement/store', data),
            fetchList: data => jwtAxios.post('/superAdmin/settlement/list', data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/settlement/update/status/${id}`, data)
        },
        bankAccounts: {
            store: data => jwtAxios.post('/superAdmin/bankaccount/store', data),
            update: (id, data) => jwtAxios.put(`/superAdmin/bankaccount/update/${id}`, data),
            fetchList: data => jwtAxios.post('/superAdmin/bankaccount/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/bankaccount/delete/${id}`),
            fetchAll: () => jwtAxios.post('/superAdmin/bankaccount/all')
        },
        seller: {
            validateToken: token => jwtAxios.post('/seller/token/validate', {token})
        },
        gifts: {
            store: data => jwtAxios.post('/superAdmin/gift', data),
            fetchList: data => jwtAxios.post('/superAdmin/gift/list', data),
            delete: id => jwtAxios.delete(`/superAdmin/gift/delete/${id}`),
            update: (id, data) => jwtAxios.put(`/superAdmin/gift/update/${id}`, data),
            updateStatus: (id, data) => jwtAxios.put(`/superAdmin/gift/update/status/${id}`, data)
        }
    }
}

export default useService