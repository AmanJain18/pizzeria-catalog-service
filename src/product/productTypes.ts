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
    image: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
    tenantId: string;
    categoryId: string;
    isPublished: boolean;
}
