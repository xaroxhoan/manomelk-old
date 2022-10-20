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
    Messages: {
        Read: {
            resource: 'Messages',
            action: 'read'
        }
    },
    Orders: {
        Read: {
            resource: 'Orders',
            action: 'read'
        }
    },
    Settlements: {
        Requests: {
            resource: 'Settlements',
            action: 'requests'
        }
    },
    BankAccounts: {
        List: {
            resource: 'BankAccounts',
            action: 'read'
        }
    },
    Transactions: {
        Read: {
            resource: 'Transactions',
            action: 'read'
        }
    },
    Reporting: {
        Read: {
            resource: 'Reporting',
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
    Menus: {
        Read: {
            resource: 'Menus',
            action: 'read'
        }
    },
    HomeSliders: {
        Read: {
            resource: 'HomeSliders',
            action: 'read'
        }
    },
    EarnLoyalityPoint: {
        Read: {
            resource: 'EarnLoyalityPoint',
            action: 'read'
        }
    },
    OfficialRetailer: {
        Read: {
            resource: 'OfficialRetailer',
            action: 'read'
        }
    },
    DaysReturn30: {
        Read: {
            resource: 'DaysReturn30',
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
    },
    SettingsGeneral: {
        Read: {
            resource: 'SettingsGeneral',
            action: 'read'
        }
    },
    SettingsAccount: {
        Read: {
            resource: 'SettingsAccount',
            action: 'read'
        }
    },
    SettingsProducts: {
        Read: {
            resource: 'SettingsProducts',
            action: 'read'
        }
    },
    SettingsCustomers: {
        Read: {
            resource: 'SettingsCustomers',
            action: 'read'
        }
    },
    SettingsNotifications: {
        Read: {
            resource: 'SettingsNotifications',
            action: 'read'
        }
    },
    SettingsGst: {
        Read: {
            resource: 'SettingsGst',
            action: 'read'
        }
    },
    SettingsSendingPrice: {
        Read: {
            resource: 'SettingsSendingPrice',
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
    }
}
