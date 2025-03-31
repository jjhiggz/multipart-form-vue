# Multiparter

The goal of Multiparter is to create a syntax for managing multipart forms using a decision tree compatible data structure.

At it's core we should be able to represent decision trees like this...

![DecisionTree](./IMG_8402.png)

With a data structure like this:

```vue
<script>
const paymentData = ref<PaymentData | null>(null)

const multiparterProps = useMultiform({
    // Used to select which form if there's multiple, otherwise this can just be null and will default to "default-multiparter"
    key: "",
    steps: [
        ({ navigate }) => ({
            component: Confirm
            isComplete: computed(() => true)
            props: {
            // typescript forces you to fill out all props
                text: "Are you sure you want to do this form"
            },
            // Typesystem forces you to handle all emits
            emits: {
                onClickConfirm: () => {
                    navigate.next()
                }
            }
        }),
        ({ navigate }) => ({
            component: GetRecipientPaymentInfoForm
            props: {
                onBack: () => navigate.back(1) // move back by one
            },
            // Typesystem forces you to handle all emits
            emits: {
            }
        }),

    ]
})
</script>
```
