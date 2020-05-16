<template>
    <div>
        <Navbar></Navbar>
        <b-container>
            <div v-if="validPetition">
                <b-alert v-if="this.success" variant="success" show>{{ this.success }}</b-alert>
                <b-alert v-if="this.error" variant="danger" show>{{ this.error }}</b-alert>

                <b-form @submit.stop.prevent="onSubmit">
                    <b-form-group id="title-input-group" label="Title" label-for="name-input">
                        <b-form-input
                            id="title-input"
                            name="title-input"
                            v-model="$v.form.title.$model"
                            :state="validateState('title')"
                            placeholder="Enter Title"
                            aria-describedby="title-live-feedback"
                        ></b-form-input>

                        <b-form-invalid-feedback id="title-live-feedback">This is a required field.</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group id="description-input-group" label="Description" label-for="description-input">
                        <b-form-textarea
                        id="description-input"
                        name="description-input"
                        v-model="$v.form.description.$model"
                        :state="validateState('description')"
                        placeholder="Enter Description"
                        aria-describedby="description-live-feedback"
                        ></b-form-textarea>

                        <b-form-invalid-feedback id="description-live-feedback">This is a required field.</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group id="category-select-group" label="Category" label-for="category-select">
                        <b-form-select
                            id="category-select"
                            name="category-select"
                            v-model="$v.form.selectedCategory.$model"
                            :state="validateState('selectedCategory')"
                            :options="categories"
                            aria-describedby="category-live-feedback"
                        ></b-form-select>

                        <b-form-invalid-feedback id="category-live-feedback">A category is required.</b-form-invalid-feedback>
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

                    <b-form-group id="image-input-group" label="Change Image" label-for="image-input">
                        <p><b-avatar :src="petitionImage" size="72px"></b-avatar></p>
                        <b-form-file
                            id="image-input"
                            name="image-input"
                            v-model="$v.form.image.$model"
                            :state="validateState('image')"
                            aria-describedby="image-live-feedback"
                        ></b-form-file>

                        <b-form-invalid-feedback id="image-live-feedback">Image must be JPEG, PNG or GIF.</b-form-invalid-feedback>
                    </b-form-group>

                    <b-button type="submit" variant="primary">Submit</b-button>
                </b-form>
            </div>
            <div v-else>
                <b-alert variant="danger" show>Invalid Petition</b-alert>
            </div>
        </b-container>
    </div>
</template>

<script>
    import Navbar from './Navbar.vue';
    import { validationMixin } from "vuelidate";
    import { required } from "vuelidate/lib/validators";

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
                    closingDate: null,
                    selectedCategory: null
                },
                categories: [],
                petitionImage: null,
                success: null,
                error: null,
                validPetition: true
            }
        },
        validations: {
            form: {
                title: {
                    required
                },
                description: {
                    required
                },
                image: {
                    validateImage(val) {
                        if (!val) return true;
                        if (val.type == 'image/jpeg' || val.type == 'image/jpg' || val.type == 'image/png'
                            || val.type == 'image/gif') {
                            return true;
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
                },
                selectedCategory: {
                    required
                }
            }
        },
        mounted() {
            this.fillForm();
        },
        methods: {
            validateState(name) {
                const { $dirty, $error } = this.$v.form[name];
                return $dirty ? !$error : null;
            },
            fillForm() {
                let id = this.$route.params.id;
                if (!id) {
                    this.validPetition = false;
                }

                // Get Petition Image
                this.$getPetitionImage(id, (petitionImage) => {
                    this.petitionImage = petitionImage;
                });

                this.axios.get('http://localhost:4941/api/v1/petitions/' + id)
                .then((res) => {
                    if (parseInt(res.data.authorId) !== parseInt(this.$getLoggedInUserId())) {
                        this.$router.push('/');
                    }

                    this.form.title = res.data.title;
                    this.form.description = res.data.description;

                    if (res.data.closingDate) {
                        let date = new Date(res.data.closingDate);
                        let now = new Date();
                        if (date < now) {
                            // Has already closed
                            this.$router.push('/');
                        }
                        this.form.closingDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
                    }

                    this.axios.get('http://localhost:4941/api/v1/petitions/categories')
                    .then((res2) => {
                        if (res2.data.length == 0) {
                            this.categories.push({ value: null, text: 'No categories available' });
                        } else {
                            this.categories.push({ value: null, text: 'Please select a category' });
                            for (var i = 0; i < res2.data.length; i++) {
                                if (res.data.category == res2.data[i].name) {
                                    this.form.selectedCategory = res2.data[i].categoryId;
                                }
                                this.categories.push({ value: res2.data[i].categoryId, text: res2.data[i].name });
                            }
                        }
                    })
                    .catch(err2 => alert(err2));
                })
                .catch((err) => {
                    this.validPetition = false;
                    //if (err.response.status == 404) {
                    //    this.validPetition = false;
                    //}
                });
            },
            onSubmit() {
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                    return;
                }

                let data = {
                    'title': this.form.title,
                    'description': this.form.description
                };
                if (this.form.selectedCategory) {
                    data['categoryId'] = this.form.selectedCategory;
                }
                if (this.form.closingDate) {
                    data['closingDate'] = this.form.closingDate;
                }

                let id = this.$route.params.id;
                this.axios.patch('http://localhost:4941/api/v1/petitions/' + id, data, {
                    headers: {
                        'X-Authorization': this.$getLoggedInToken()
                    }
                })
                .then((res) => {
                    if (this.form.image) {
                        this.axios.put('http://localhost:4941/api/v1/petitions/' + id + '/photo', this.form.image, {
                            headers: {
                                'Content-Type': this.form.image.type,
                                'X-Authorization': this.$getLoggedInToken()
                            }
                        })
                        .then((res2) => {
                            this.success = 'Saved image';
                        })
                        .catch((err2) => {
                            this.error = 'Failed saving image';
                        });
                    } else {
                        this.success = 'Saved';
                    }
                })
                .catch((err) => {
                    this.error = 'Failed saving data';
                });
            }
        }
    }
</script>
