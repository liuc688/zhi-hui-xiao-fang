<template>
    <div>
        <a-card>
            <a-button slot="extra" type="primary" icon="save" @click="onSubmit">
                保存提交
            </a-button>
            <k-form-build :value="jsonData" ref="form" :dynamicData="dynamicData" :config="config"
                @change="handleChange" />
        </a-card>
    </div>
</template>
<script>
import { form_get } from "@/services/forms";
import { formSetData } from "@/utils/util"
import { usenote_add, usenote_edit, usenote_tree } from "@/services/usenote";
export default {
    props: {
        data: {
            type: Object,
            default: () => {
                return {}
            }
        },
        event: {
            type: Function,
        },
    },
    computed: {
        dynamicData() {
            return {
                tree: this.tree
            }
        },
        config() {
            return {

            }
        },
        methodes() {
            return this.data.id ? usenote_edit : usenote_add;
        }
    },
    data() {
        return {
            jsonData: {},
            forms: {},
            loading: true,
            tree: []
        }
    },
    created() {
        console.log('params', this.data)
        this.onLoad()
    },
    methods: {
        onLoad() {
            Promise.all([form_get({
                name: "usenote_add_edit"
            }), usenote_tree()]).then(response => {
                this.jsonData = response[0].data.data.form
                this.tree = response[1].data.data;
                this.$nextTick(() => {
                    if (this.data.id) {
                        formSetData(this.$refs.form, this.data, {})
                    }
                })
            }).catch(error => {
                console.log(error);
            })
        },
        handleChange() {

        },
        onSubmit() {
            this.$refs.form.getData().then(response => {
                console.log(response);
                const formData = {
                    ...response,
                    id: this.data.id
                }
                this.methodes(formData).then(res => {
                    console.log('res',res)
                    this.$emit("event", {
                        method: "onLoad",
                        params: {}
                    })
                    this.$emit("event", {
                        method: "onLink",
                        params: {
                            router: "check",
                            params: this.data
                        }
                    })
                }).catch(err => {
                    console.log(err);
                })

            }).catch(error => {
                console.log(error);
            })
        }

    }
}
</script>
<style lang="">
    
</style>