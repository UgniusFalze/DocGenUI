export type ClientSelect = {
    clientId: number,
    clientName: string
}

export type ClientForm = {
    buyerName: string,
    buyerAddress: string,
    buyerCode: number
    vatCode: string|null
}

export type ClientGridRow = ClientForm & {
    clientId: number
}