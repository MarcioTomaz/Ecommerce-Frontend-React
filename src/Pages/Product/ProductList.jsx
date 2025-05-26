import {IconHeart} from '@tabler/icons-react';
import {Card, Image, Text, Group, Button, Container, Grid} from '@mantine/core';
import classes from './ProductListCSS.module.css';
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";
import {ROUTES} from "../../routes/URLS.jsx";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";

const ProductList = () => {
    const [productData, setProductData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { login, userToken } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        axios.get(`${API_URL}${ROUTES.PRODUCT_LIST_STOCK}`)
            .then( response => {
                setProductData(response.data);
                setIsLoading(false);
            }).catch(error => {
                setError(error);
                setIsLoading(false)
        })
    }, [userToken]);

    const navigateProduct = (id) =>{
        navigate(ROUTES.PRODUCT_DETAILS.replace(':id', id));
    }

    return (
        <Container>
            <Grid gutter="md" justify="center">
                {productData.map((product, index) => {
                    // const {image, product_name, productCategory, product_description, product_price} = product;

                    const {id, product_name, productCategory, product_description, product_price, currency} = product;

                    return (
                        <Grid.Col key={index} span={4} sm={6} md={4}>
                            <Card
                                withBorder
                                radius="md"
                                p="md"
                                className={classes.card}
                                style={{
                                    minWidth: 300,
                                    minHeight: 400,
                                    margin: '0 auto'
                                }}  // Define o tamanho mínimo para o card e adiciona margem automática
                            >
                                <Card.Section>
                                    <Image src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAY1BMVEX39/cAAAD////7+/vw8PCRkZFcXFwQEBD09PS0tLTt7e3c3Nyvr68wMDDm5ubR0dF9fX3BwcE6OjptbW3KysqXl5ekpKQnJydMTEwgICBUVFRzc3MVFRVFRUWGhoYJCQllZWWJRKi4AAAJ6UlEQVR4nO1c2YKyOgxmGlH2TUAFRd//KQ+40LSkC4vzn4vJpdL2I83WJMVx/uj3CIB9CAD+J2iCMM1zP4r8PE/D3RvcP8LjBGFZZ+cfmQ5NF6VJD+53gfUMcsqqbQ4TQCOd9lmU/B7HgO3Cesofiq5ZmfQc/ToxFlZ7K0QvKrIcvruPwALfjkeYDl3ofI1dPST3NhvSk44++wosgCRbhuhJhe9tD4vtuusKTD010cbcYl6lhXS9nHq6GGCfyw1FHliuFO9Dk9VRXqZhGKZp2dv1KmsuSlhdshWzmEKYLrc2SrzetAMnNui/l5TuvriTg3xnE2ax/ETNfqxTUHmSwSUGedVQ4x7BemaB0xE8aqLAFA8MzjGpblN+xf5a38OSqfk+Vamls+33siTeqVq3hSyd+NzB4MyYk0HiTrb/vFuxhayWud/4sx1s7whqWR/jdCkqYJW8ccvM8uCfJI7f82WogMmWoF7sKYCFk8kWvR5I0+zDNfYYIC9WowI4ClNc67UugjnSW1azUUl7F2/gHwDKdbxionlxvW2cQ3JcgYrV0uCNvDuA+LJzdJD5eORhsVExTv1TWk/NQhwYxfYD7VBhg3xJLPcAAuwXthBxEVWKURU7O1TQ4kFb7t0bVY5RdVbzC87ltDWfnisIpiGyWAFwYHC3l6c5QRKLsFiFxpHg4aOdNSZgyRyeCqj2nvFxFz1u6wj6cKaKC3+GNRMchsmGCp7ATgaHEKD6KIU1LKxNd9MGouj3YuVbnlz6DGmtkwYQoLdvtQth93INbdSCJWIkWNnGXEKkrXM3EKC41UKgBC69qckt9xCbnptmCHaXjRmTzKU3PWxYPAxH50K1rEOCOJqa3pdBXUwRDXSprE4XEPIhxU65DIp2TJvHdhF9Ln/SKbexpViCVayCkC9z1ftJxkwZvTYxixY43PPHiqfxScHXMYp5uSzeBFXmpAHLTayChKveWWP5geV2mdizhR7ymWhng1VUbTf66J9MppBkPJXheKGkHgW+wYUKE7B0VuLzUhlMPOOieSSexPurYFTv5FpiZS3FuTbFglh1CKYPIjEvaImC0KWWNdFRu4ceZ9VU1CE5af59vZVPpvSMdNdlOpGtekx4gY4+J9UJgwULM+lxpDTxiBn3ybqMKyclce8ZWLqw5FCkKiOD3Mg0WucTkLr5mcIjfbAFqfwIEnU5BkC6F5Pv9AHaa+CcItaHzkpOOTvuHaSoEoXmLsUoxosFAJE6e0/TLdeEDUjtJVPkPVT/vEFdH8EIiwVHamkVGWpFSMVc4Tnk92JS99j9586tc+/+FKHUlGKelKTDGQhH/RONAqTjJHTEyQ6vXRiZtes0BWROp2pkMECYkKyCUaNFhiATRkd37AWhHQ9RvXUwO+YLgsR6f5CTrEJnQCHcZQ/6dxnUz9Xlm+HUMggJUpfACClwewFRgOJCJVgqxhNSATVuBCWUVlii8c9XN+FcSl74aVAoVm8RKIDx5xuJCYHqxZGv5viKEPSaIS559fspRfSxG4fhmAljNYPqVXeMdJlHFISexUauErwIogqyuXSiB5A9V5xiRFC9HnKdSifW4RgCsrTobwUoZD5RTIWUT5HCYrIBeIx62J//hNpxhrjkRcL2qkBxf4rUDDkZxbgJqJ+LO7oOFnLl3SMusVyKKVRvzLNVSOq4pbgqQoQpqKGmxWXZv0n8662/P9lXFShuE1AswTf1pEgVUaB64Rl3qrfwQ9CEgomcsK0KUFCOsyOR5hmseBYofOJkYT42QzCH7hlQgeLeD+XpeIxQEEcKHSjUAAHcXZcP+mElqFEdMhKUIoegBPXcQ+FJoDZODyrhoPjyq0D1wQk/Q/V+WuN6VKCCUSVITt0UeU4dqP5VPqltUG3cKlBLODVQ9Xoq0j/1y6CaZyaOGY7QSpnioPjy3CTM1r437VeBCilB5xZ9rp3aCBRlp9hCi74VqHT06BjUONlhhu/bDBQdOaHQxTpK2BJURD2BoKrSQJr89HpQPJ5CtTwUDpOH9i+DQpEnEmngOZcHOWwjUKoYnYcU+BDN16RzLt8FxU8zV+Hcxx07ncb7JiiUM9gLoPhs9Nnsm6BUOQOUTqNrtF8FxbNwgpVE6nf7bVAoRpCKycGoALSj+SYo3tDRiFU/ZCrIkdtYdBoUN52Z+D8StozklH61NaBQd4b0PxKqA1U5ZYaa43JQuGgrmyN20Q51nFrbbL4cFGq0mxTP0HyKrKe2grXc93k8BTIJBpBZVbTpAEyTA/NAHQjDjNvhpuvuuKdRVdqfCYPloDKymMXPZA9iRT5hrDg9DCleRcHIDArliPCMSMyJUM7w9wgrIot+JlB7xZ0LlJa+U6c7pPWFpsRKp4T1oOJcUQgB1CeZkUbb2CTwYRZRb9eBuqkvzOBWCFq9Ai4v6taT59reJK2vBnWJ1E0TWGRUaWm0lKth1fCofGtFBaqodT0AuC9I0f4HO77Bpk5VgFIwWjSoQ6XteMECc1Zhxz0cR1NHCLAapaMpUHG10zdwIHlRd0bhNgCLBmjcyD0FdXdNfUGYB5quPKHj29xq3OvhWQEqdg1cEhybtn8RPFQdJuMq+S0+eiiB6iy6pzwk5aSNGhdBomfXesqCTgYVuzbXfXD7qaKPZSRc37dqsAY2dHghUDZckl7f0NMMIQrGT3ZtiIzVl3d6sTt1jl1HZYAsirpl5LMC1uqzbctmWD83AErbuzWYUQcLlcIb2FjeAvlUG6z7v7E50Pb/vecVuv2PX7rYjPJkjc0KYjK8/c7tdO6KLa9eiBee2u/wagxaLK/OgCPES+02t4vkRVg2iElsfZ0HhHszP/uv8Aogrbt6xh0EVgqozpZt03NhsXnfeZAuJ8XfQTWX5HrUJlfEBmu2ah7p3tpPt+ZC7HvKsDq21arbQTKqa7rOYo0thnQXju0sckUxW/HFAxQPqmpSlqh8KfsTRws/WwHCCXbRvVqOKpVzUvt8yYcY+p3D/Y7GSMUw27SnsylnKtBwYVtssloJqg/ap82T+2jG5fbhso+c1Vq3fc6z/2maF4670LNRRQAvbSeNqoXtjUwN0V2KTaX+hMN7HIO0orJZm1ytBHCpHOy1OPqfj11Iz/d4vCDPCmrYbatrseoe5ritojwM+PenejxBmtedKsO9xtZJBE6u7mE+nIrbrTlmPbXH5lbE6kcLMsW4mNhOn0e3ofUf35Bp0O1VsC71Bp8pIWFZ91bLVNTGhMdiWIEmv6+D5AdfgvQkxtJuJq64S7/znSdEAEF5tL5PcH3kwe9816x/8dw9Gm/23Pdu7nydSSKuJI1a5TW/e9Hl4a9/le7lTnpoZeR27XG/b86387nZP9rMrfMQ/tX3+17QXp8P3AUv2nkA/+yDgn/0R3+0mv4DVqV59kuFDMsAAAAASUVORK5CYII='} alt={product_name} height={180}/>
                                </Card.Section>

                                <Card.Section>
                                    {id}
                                </Card.Section>

                                <Card.Section className={classes.section} mt="md">
                                    <Group position="apart">
                                        <Text fz="lg" fw={500}>
                                            {product_name}
                                        </Text>
                                    </Group>
                                    <Text fz="sm" mt="xs">
                                        {product_description}
                                    </Text>
                                </Card.Section>

                                <Card.Section className={classes.section}>
                                    <Group gap={30}>
                                        <div>
                                            <Text fz="xl" fw={700} style={{lineHeight: 1}}>
                                                {currency.symbol}    {product_price}
                                            </Text>
                                        </div>
                                        <Button onClick={() => navigateProduct(product.id)} radius="xl" style={{flex: 1}}>
                                            Detalhes
                                        </Button>
                                    </Group>
                                </Card.Section>
                            </Card>
                        </Grid.Col>
                    );
                })}
            </Grid>
        </Container>
    );
}

export default ProductList;
