type ParamsType = {
    params: {
        productId: string;
    }
}

function Page({ params }: ParamsType) {
    return (
        <div>
            <h1>Product {params.productId}</h1>
        </div>
    )
}

export default Page;
