type ParamsType = {
    params: Promise<{
        productId: string;
    }>
}

async function Page(props: ParamsType) {
    const params = await props.params;
    return (
        <div>
            <h1>Product {params.productId}</h1>
        </div>
    )
}

export default Page;
