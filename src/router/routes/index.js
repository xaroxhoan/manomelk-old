import { lazy } from "react"
import { Permissions } from "../../hooks/Acl"
import authRoutes from "./authRoutes"


// ** Document title
const TemplateTitle = "Shop-SuperAdmin"

// ** Default Route
const DefaultRoute = "/home"

// ** Merge Routes
const Routes = [
  {
    path: "/home",
    component: lazy(() => import("../../views/Home")),
    permissions: [
      { action: Permissions.Dashboard.Read.action, resource: Permissions.Dashboard.Read.resource }
    ]
  },
  {
    path: "/adverts",
    component: lazy(() => import("../../views/adverts/List")),
    permissions: [
      { action: Permissions.Adverts.Read.action, resource: Permissions.Adverts.Read.resource }
    ]
  },
  {
    path: "/tarrifs",
    component: lazy(() => import("../../views/tarrifs/List")),
    permissions: [
      { action: Permissions.Tarrifs.Read.action, resource: Permissions.Tarrifs.Read.resource }
    ]
  },
  {
    path: "/operators",
    component: lazy(() => import("../../views/operators/List")),
    permissions: [
      { action: Permissions.Operators.Read.action, resource: Permissions.Operators.Read.resource }
    ]
  },
  {
    path: "/users",
    component: lazy(() => import("../../views/users/List")),
    permissions: [
      { action: Permissions.Users.Read.action, resource: Permissions.Users.Read.resource }
    ]
  },
  {
    path: "/advisors",
    component: lazy(() => import("../../views/advisors/List")),
    permissions: [
      { action: Permissions.Advisors.Read.action, resource: Permissions.Advisors.Read.resource }
    ]
  },
  {
    path: "/creators",
    component: lazy(() => import("../../views/creators/List")),
    permissions: [
      { action: Permissions.Creators.Read.action, resource: Permissions.Creators.Read.resource }
    ]
  },
  {
    path: "/articles/categories",
    component: lazy(() => import("../../views/blog/Categories")),
    permissions: [
      { action: Permissions.ArticleCategories.Read.action, resource: Permissions.ArticleCategories.Read.resource }
    ]
  },
  {
    path: "/articles/reviews",
    component: lazy(() => import("../../views/blog/BlogReviews")),
    permissions: [
      { action: Permissions.ArticleReviews.Read.action, resource: Permissions.ArticleReviews.Read.resource }
    ]
  },
  {
    path: "/articles/create",
    component: lazy(() => import("../../views/blog/Create")),
    permissions: [
      { action: Permissions.Articles.Read.action, resource: Permissions.Articles.Read.resource }
    ]
  },
  {
    path: "/articles/update/:id",
    component: lazy(() => import("../../views/blog/Update")),
    permissions: [
      { action: Permissions.Articles.Read.action, resource: Permissions.Articles.Read.resource }
    ]
  },
  {
    path: "/articles",
    component: lazy(() => import("../../views/blog/List")),
    permissions: [
      { action: Permissions.Articles.Read.action, resource: Permissions.Articles.Read.resource }
    ]
  },
  {
    path: "/profile",
    component: lazy(() => import("../../views/profile/Index"))
  },
  {
    path: "/transactions",
    component: lazy(() => import("../../views/transactions/Index")),
    permissions: [
      { action: Permissions.Transactions.Read.action, resource: Permissions.Transactions.Read.resource }
    ]
  },
  {
    path: "/messages",
    component: lazy(() => import("../../views/messages/Index")),
    permissions: [
      { action: Permissions.Messages.Read.action, resource: Permissions.Messages.Read.resource }
    ]
  },
  {
    path: "/reporting",
    component: lazy(() => import("../../views/reporting/Index")),
    permissions: [
      { action: Permissions.Reporting.Read.action, resource: Permissions.Reporting.Read.resource }
    ]
  },
  {
    path: "/shop-info",
    component: lazy(() => import("../../views/undermenu/ShopInfo")),
    permissions: [
      { action: Permissions.ShopInfo.Read.action, resource: Permissions.ShopInfo.Read.resource }
    ]
  },
  {
    path: "/social-media",
    component: lazy(() => import("../../views/undermenu/SocialMedia")),
    permissions: [
      { action: Permissions.SocialMedia.Read.action, resource: Permissions.SocialMedia.Read.resource }
    ]
  },
  {
    path: "/newsletter",
    component: lazy(() => import("../../views/newsletter/Index")),
    permissions: [
      { action: Permissions.Newsletter.Read.action, resource: Permissions.Newsletter.Read.resource }
    ]
  },
  {
    path: "/contactus",
    component: lazy(() => import("../../views/contactus/Index")),
    permissions: [
      { action: Permissions.ContactUs.Read.action, resource: Permissions.ContactUs.Read.resource }
    ]
  },
  {
    path: "/faq",
    component: lazy(() => import("../../views/faq/List")),
    permissions: [
      { action: Permissions.Faq.Read.action, resource: Permissions.Faq.Read.resource }
    ]
  },
  {
    path: "/faq-topics",
    component: lazy(() => import("../../views/faqTopics/List")),
    permissions: [
      { action: Permissions.FaqTopic.Read.action, resource: Permissions.FaqTopic.Read.resource }
    ]
  },
  {
    path: "/error",
    component: lazy(() => import("../../views/Error")),
    layout: "BlankLayout"
  },
  ...authRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
