import { defineAbility } from '@casl/ability'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { AbilityContext } from '../utility/context/Can'

export const useAcl = () => {
    const userData = useSelector((state) => state.auth.userData)
    return {
        ability: () => defineAbility((can, cannot) => {
            if (userData === undefined || userData === null) {
                return
            }
            const permissions = userData.permissions
            if (permissions === undefined || permissions === null) {
                return
            }
            if (permissions.length <= 0) {
                can('manage', 'all')
                return
            }
            for (const permission of permissions) {
                can(permission.action, permission.resource)
            }
        })
    }
}

export const usePermission = () => {
    const ability = useContext(AbilityContext)
    return ability
}

export const PermissionPersianTitle = (key, action) => {
    let result = ""
    switch (key) {
        case "Dashboard":
            result = "داشبورد"
            break
        case "Adverts":
            result = "آگهی ها"
            break
        case "Tarrifs":
            result = "تعرفه ها"
            break
        case "Operators":
            result = "اپراتورها"
            break
        case "Users":
            result = "آگهی دهنده ها"
            break
        case "Advisors":
            result = "مشاوران املاک"
            break
        case "Creators":
            result = "سازنده ها"
            break
        case "Transactions":
            result = "تراکنش ها"
            break
        case "Faq":
            result = "سوالات متداول"
            break
        case "FaqTopic":
            result = "گروه های سوالات متداول"
            break
        case "Messages":
            result = "تیکت ها"
            break
        case "Reporting":
            result = "گزارش ها"
            break
        case "Newsletter":
            result = "خبرنامه"
            break
        case "ContactUs":
            result = "تماس با ما"
            break
        case "Articles":
            result = "مقالات"
            break
        case "ArticleCategories":
            result = "دسته بندی مقالات"
            break
        case "ArticleReviews":
            result = "نظرات مقالات"
            break
        case "ShopInfo":
            result = "اطلاعات فروشگاه"
            break
        case "SocialMedia":
            result = "شبکه های اجتماعی"
            break
    }
    return result
}

export const Permissions = {
    Dashboard: {
        Read: {
            resource: 'Dashboard',
            action: 'read'
        }
    },
    Adverts: {
        Read: {
            resource: 'Adverts',
            action: 'read'
        }
    },
    Tarrifs: {
        Read: {
            resource: 'Tarrifs',
            action: 'read'
        }
    },
    Operators: {
        Read: {
            resource: 'Operators',
            action: 'read'
        }
    },
    Users: {
        Read: {
            resource: 'Users',
            action: 'read'
        }
    },
    Advisors: {
        Read: {
            resource: 'Advisors',
            action: 'read'
        }
    },
    Creators: {
        Read: {
            resource: 'Creators',
            action: 'read'
        }
    },
    Transactions: {
        Read: {
            resource: 'Transactions',
            action: 'read'
        }
    },
    Faq: {
        Read: {
            resource: 'Faq',
            action: 'read'
        }
    },
    FaqTopic: {
        Read: {
            resource: 'FaqTopic',
            action: 'read'
        }
    },
    Messages: {
        Read: {
            resource: 'Messages',
            action: 'read'
        }
    },
    Reporting: {
        Read: {
            resource: 'Reporting',
            action: 'read'
        }
    },
    Newsletter: {
        Read: {
            resource: 'Newsletter',
            action: 'read'
        }
    },
    ContactUs: {
        Read: {
            resource: 'ContactUs',
            action: 'read'
        }
    },
    Articles: {
        Read: {
            resource: 'Articles',
            action: 'read'
        }
    },
    ArticleCategories: {
        Read: {
            resource: 'ArticleCategories',
            action: 'read'
        }
    },
    ArticleReviews: {
        Read: {
            resource: 'ArticleReviews',
            action: 'read'
        }
    },
    ShopInfo: {
        Read: {
            resource: 'ShopInfo',
            action: 'read'
        }
    },
    SocialMedia: {
        Read: {
            resource: 'SocialMedia',
            action: 'read'
        }
    }
}
