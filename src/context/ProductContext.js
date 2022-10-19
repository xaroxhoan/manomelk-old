import React, { useContext } from 'react'

const ProductContext = React.createContext({
    state: {},
    errors: {},
    setState: _ => {},
    setErrors: _ => {}
})

export const INITIAL_PRODUCT_STATE = {
    title: '',
    alias: '',
    price: '',
    description: '',
    comparePrice: 0,
    category: null,
    brand: null,
    sku: '',
    sortOrder: 0,
    images: [],
    sortOrder: 0,
    quantity: 0,
    isInventoryTrack: false,
    seller: null,
    sellerStatus: { label: 'Approved', value: 'approved' },
    pageTitle: '',
    metaDescription: '',
    metaKeywords: [],
    canonicalUrl: '',
    sitemapPriority: '',
    sitemapFrequency: '',
    variants: [], 
    options: [{ name: '', values: [] }],
    attributes: [],
    productAttributes: [],
    isInitialLoadFromService: false,
    successMessage: '',
    isShowWhyMe: false,
    isShowWhatsInside: false,
    isShowHowToUse: false,
    isShowFragrance: false,
    descriptionWhyMe: "",
    descriptionWhatsInside: "",
    descriptionHowToUse: "",
    descriptionFragrance: ""
}

export const useProduct = () => useContext(ProductContext)

export default ProductContext