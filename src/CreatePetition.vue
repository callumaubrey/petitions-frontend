<template>
    <div>
        <Navbar></Navbar>

        <b-container>
            <div v-if="this.$isLoggedIn()">
                <h3>Create a Petition</h3>

                <b-alert v-if="this.success" variant="success" show>{{ this.success }}</b-alert>
                <b-alert v-if="this.error" variant="danger" show>{{ this.error }}</b-alert>

                <b-form @submit.stop.prevent="onSubmit" @reset.stop.prevent="onReset">
                    <b-form-group id="title-input-group" label="Title" label-for="title-input">
                        <b-form-input
                            id="title-input"
                            name="title-input"
                            v-model="$v.form.title.$model"
                            :state="validateState('title')"
                            aria-describedby="title-live-feedback"
                            placeholder="Enter title"
                        ></b-form-input>

                        <b-form-invalid-feedback id="title-live-feedback">This is a required field.</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group id="email-input-group" label="Description" label-for="description-input">
                        <b-form-textarea
                            id="description-input"
                            name="description-input"
                            v-model="$v.form.description.$model"
                            :state="validateState('description')"
                            aria-describedby="description-live-feedback"
                            placeholder="Enter description"
                        ></b-form-textarea>

                        <b-form-invalid-feedback id="description-live-feedback">This is a required field.</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group id="category-select-group" label="Category" label-for="category-select">
                        <b-form-select
                            id="category-select"
                            name="category-select"
                            v-model="$v.form.selectedCategory.$model"
                            :state="validateState('selectedCategory')"
                            aria-describedby="category-live-feedback"
                            :options="categories"
                        ></b-form-select>

                        <b-form-invalid-feedback id="category-live-feedback">This is a required field.</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group id="image-input-group" label="Upload Image" label-for="image-input">
                        <b-form-file
                            id="image-input"
                            name="image-input"
                            v-model="$v.form.image.$model"
                            :state="validateState('image')"
                            aria-describedby="image-live-feedback"
                        ></b-form-file>

                        <b-form-invalid-feedback id="image-live-feedback">This is a required field and must be either a JPEG, PNG or GIF.</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group id="" label="Closing Date" label-for="closing-date-input">
                        <b-form-datepicker
                            id="closing-date-input"
                            name="closing-date-input"
                            v-model="$v.form.closingDate.$model"
                            :state="validateState('closingDate')"
                            class="mb-2"
                            format="YYYY-MM-DD"
                            aria-describedby="closing-date-live-feedback"
                        ></b-form-datepicker>

                        <b-form-invalid-feedback id="closing-date-live-feedback">Closing date must be in the future.</b-form-invalid-feedback>
                    </b-form-group>
                    <b-button type="submit" variant="primary">Submit</b-button>
                    <b-button type="reset" variant="danger">Reset</b-button>
                </b-form>
            </div>
        </b-container>
    </div>
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { required } from "vuelidate/lib/validators";
    import Navbar from './Navbar.vue';

    export default {
        components: {
            Navbar
        },
        mixins: [validationMixin],
        data() {
            return {
                form: {
                    title: null,
                    description: null,
                    image: null,
                    selectedCategory: null,
                    closingDate: null
                },
                categories: [],
                error: null,
                success: null
            };
        },
        validations: {
            form: {
                title: {
                    required
                },
                description: {
                    required
                },
                selectedCategory: {
                    required
                },
                image: {
                    required,
                    validateImage(val) {
                        if (val) {
                            if (val.type == 'image/jpeg' || val.type == 'image/jpg' || val.type == 'image/png'
                              || val.type == 'image/gif') {
                              return true;
                            }
                        }
                        return false;
                    }
                },
                closingDate: {
                    validateDate(val) {
                        let now = this.$getYearMonthDayDate();
                        if (val <= now) {
                            return false;
                        }
                        return true;
                    }
                }
            }
        },
        mounted() {
            this.fillCategories();
        },
        methods: {
            validateState(name) {
                const { $dirty, $error } = this.$v.form[name];
                return $dirty ? !$error : null;
            },
            fillCategories() {
                if (!this.$isLoggedIn()) {
                    this.$router.push('/login');
                    return;
                }

                this.axios.get('http://localhost:4941/api/v1/petitions/categories')
                .then((res) => {
                    if (res.data.length == 0) {
                        this.categories.push({ value: null, text: 'No categories available' });
                    } else {
                        this.categories.push({ value: null, text: 'Please select a category' });
                        for (var i = 0; i < res.data.length; i++) {
                            this.categories.push({ value: res.data[i].categoryId, text: res.data[i].name });
                        }
                    }
                })
                .catch(err => alert(err));
            },
            onSubmit() {
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                    return;
                }

                let data = {
                    'title': this.form.title,
                    'description': this.form.description,
                    'categoryId': this.form.selectedCategory
                };

                if (this.form.closingDate) {
                    data['closingDate'] = this.form.closingDate;
                }

                this.axios.post('http://localhost:4941/api/v1/petitions', data, {
                    headers: {
                        'X-Authorization': this.$getLoggedInToken()
                    }
                })
                .then((res) => {
                    let insertId = res.data.petitionId;
                    this.axios.put('http://localhost:4941/api/v1/petitions/' + insertId + '/photo', this.form.image, {
                        headers: {
                            'Content-Type': this.form.image.type,
                            'X-Authorization': this.$getLoggedInToken()
                        }
                    })
                    .then((res2) => {
                        // Now we need to sign it
                        this.axios.post('http://localhost:4941/api/v1/petitions/' + insertId + '/signatures', {}, {
                            headers: {
                                'X-Authorization': this.$getLoggedInToken()
                            }
                        })
                        .then((res3) => {
                            this.$router.push('/my-petitions');
                        })
                        .catch(err3 => alert(err3));
                    })
                    .catch((err2) => {
                        this.error = err2;
                    });
                })
                .catch((err) => {
                    this.error = err;
                });
            },
            onReset() {
                this.form.title = null;
                this.form.selectedCategory = null;
                this.form.description = null;
                this.form.closingDate = null;
                this.$v.$reset();
            }
        }
    }
</script>
