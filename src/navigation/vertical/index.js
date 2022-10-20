import { Home, Circle, Users, Layers, ShoppingBag, BarChart, Tag, Upload, Settings, Grid, Box, Globe, CreditCard, Mail, Phone, Info, MessageCircle, Percent, Share, Instagram, AtSign } from "react-feather"
import { Permissions } from "../../hooks/Acl"

export default [
  {
    header: 'امکانات اصلی'
  },
  {
    id: "dashboard",
    title: "داشبورد",
    icon: <Home size={20} />,
    navLink: "/home",
    permissions: [
      { action: Permissions.Dashboard.Read.action, resource: Permissions.Dashboard.Read.resource }
    ]
  },
  {
    id: 'adverts-menu',
    title: 'آگهی ها',
    icon: <Grid size={20} />,
    permissions: [
      { action: Permissions.Adverts.Read.action, resource: Permissions.Adverts.Read.resource }
    ],
    children: [
      {
        id: 'adverts',
        title: 'لیست',
        icon: <Circle size={20} />,
        navLink: '/adverts',
        permissions: [
          { action: Permissions.Adverts.Read.action, resource: Permissions.Adverts.Read.resource }
        ]
      }
    ]
  },
  {
    id: 'users-menu',
    title: 'کاربران',
    icon: <Users size={20} />,
    permissions: [
      { action: Permissions.Operators.Read.action, resource: Permissions.Operators.Read.resource },
      { action: Permissions.Users.Read.action, resource: Permissions.Users.Read.resource },
      { action: Permissions.Advisors.Read.action, resource: Permissions.Advisors.Read.resource },
      { action: Permissions.Creators.Read.action, resource: Permissions.Creators.Read.resource }
    ],
    children: [
      {
        id: 'operators',
        title: 'اپراتورها',
        icon: <Circle size={20} />,
        navLink: '/operators',
        permissions: [
          { action: Permissions.Operators.Read.action, resource: Permissions.Operators.Read.resource }
        ]
      },
      {
        id: 'users',
        title: 'آگهی دهنده ها',
        icon: <Circle size={20} />,
        navLink: '/users',
        permissions: [
          { action: Permissions.Users.Read.action, resource: Permissions.Users.Read.resource }
        ]
      },
      {
        id: 'advisors',
        title: 'مشاوران املاک',
        icon: <Circle size={20} />,
        navLink: '/advisors',
        permissions: [
          { action: Permissions.Advisors.Read.action, resource: Permissions.Advisors.Read.resource }
        ]
      },
      {
        id: 'creators',
        title: 'سازنده ها',
        icon: <Circle size={20} />,
        navLink: '/creators',
        permissions: [
          { action: Permissions.Creators.Read.action, resource: Permissions.Creators.Read.resource }
        ]
      }
    ]
  },
  {
    id: 'orders-menu',
    title: 'تراکنش ها',
    icon: <ShoppingBag size={20} />,
    permissions: [
      { action: Permissions.Orders.Read.action, resource: Permissions.Orders.Read.resource },
      { action: Permissions.Transactions.Read.action, resource: Permissions.Transactions.Read.resource }
    ],
    children: [
      {
        id: 'transactions',
        title: 'لیست',
        icon: <Circle size={20} />,
        navLink: '/transactions',
        permissions: [
          { action: Permissions.Transactions.Read.action, resource: Permissions.Transactions.Read.resource }
        ]
      }
    ]
  },
  {
    id: 'faq-menu',
    title: 'سوالات متداول',
    icon: <Info size={20} />,
    permissions: [
      { action: Permissions.Faq.Read.action, resource: Permissions.Faq.Read.resource },
      { action: Permissions.FaqTopic.Read.action, resource: Permissions.FaqTopic.Read.resource }
    ],
    children: [
      {
        id: 'faq-list',
        title: 'لیست',
        icon: <Circle size={20} />,
        navLink: '/faq',
        permissions: [
          { action: Permissions.Faq.Read.action, resource: Permissions.Faq.Read.resource }
        ]
      },
      {
        id: 'faq-topics',
        title: 'گروه ها',
        icon: <Circle size={20} />,
        navLink: '/faq-topics',
        permissions: [
          { action: Permissions.FaqTopic.Read.action, resource: Permissions.FaqTopic.Read.resource }
        ]
      }
    ]
  },
  {
    id: 'messages',
    title: 'تیکت ها',
    icon: <MessageCircle size={20} />,
    navLink: '/messages',
    permissions: [
      { action: Permissions.Messages.Read.action, resource: Permissions.Messages.Read.resource }
    ]
  },
  {
    id: 'reporting',
    title: 'گزارش ها',
    icon: <BarChart size={20} />,
    navLink: '/reporting',
    permissions: [
      { action: Permissions.Reporting.Read.action, resource: Permissions.Reporting.Read.resource }
    ]
  },
  {
    id: 'newsletter',
    title: 'خبرنامه',
    icon: <Mail size={20} />,
    navLink: '/newsletter',
    permissions: [
      { action: Permissions.Newsletter.Read.action, resource: Permissions.Newsletter.Read.resource }
    ]
  },
  {
    id: 'contactus',
    title: 'تماس با ما',
    icon: <Phone size={20} />,
    navLink: '/contactus',
    permissions: [
      { action: Permissions.ContactUs.Read.action, resource: Permissions.ContactUs.Read.resource }
    ]
  },
  {
    header: 'وبلاگ',
    permissions: [
      { action: Permissions.Articles.Read.action, resource: Permissions.Articles.Read.resource },
      { action: Permissions.ArticleCategories.Read.action, resource: Permissions.ArticleCategories.Read.resource },
      { action: Permissions.ArticleReviews.Read.action, resource: Permissions.ArticleReviews.Read.resource }
    ]
  },
  {
    id: 'blog',
    title: 'وبلاگ',
    icon: <Layers size={20} />,
    permissions: [
      { action: Permissions.Articles.Read.action, resource: Permissions.Articles.Read.resource },
      { action: Permissions.ArticleCategories.Read.action, resource: Permissions.ArticleCategories.Read.resource },
      { action: Permissions.ArticleReviews.Read.action, resource: Permissions.ArticleReviews.Read.resource }
    ],
    children: [
      {
        id: 'articles',
        title: 'مقالات',
        icon: <Circle size={20} />,
        navLink: '/articles',
        permissions: [
          { action: Permissions.Articles.Read.action, resource: Permissions.Articles.Read.resource }
        ]
      },
      {
        id: 'articles-cat',
        title: 'دسته ها',
        icon: <Circle size={20} />,
        navLink: '/articles/categories',
        permissions: [
          { action: Permissions.ArticleCategories.Read.action, resource: Permissions.ArticleCategories.Read.resource }
        ]
      },
      {
        id: 'articles-comments',
        title: 'نظرات',
        icon: <Circle size={20} />,
        navLink: '/articles/reviews',
        permissions: [
          { action: Permissions.ArticleReviews.Read.action, resource: Permissions.ArticleReviews.Read.resource }
        ]
      }
    ]
  },
  {
    header: 'وب سایت',
    permissions: [
      { action: Permissions.Menus.Read.action, resource: Permissions.Menus.Read.resource },
      { action: Permissions.HomeSliders.Read.action, resource: Permissions.HomeSliders.Read.resource }
    ]
  },
  {
    id: 'shop-info',
    title: 'اطلاعات تماس',
    icon: <AtSign size={20} />,
    navLink: '/shop-info',
    permissions: [
      { action: Permissions.ShopInfo.Read.action, resource: Permissions.ShopInfo.Read.resource }
    ]
  },
  {
    id: 'social-media',
    title: 'شبکه های اجتماعی',
    icon: <Instagram size={20} />,
    navLink: '/social-media',
    permissions: [
      { action: Permissions.SocialMedia.Read.action, resource: Permissions.SocialMedia.Read.resource }
    ]
  }
]
