export interface PriceConfiguration {
    [key: string]: {
        priceType: 'base' | 'additional';
        sizeOptions: number[];
    };
}

export interface Attribute {
    name: string;
    value: string;
}

export interface Product {
    name: string;
    description: string;
    image?: string;
    priceConfiguration: string;
    attributes: string;
    tenantId: string;
    categoryId: string;
    isPublished: boolean;
}
