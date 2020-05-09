<template>
    <div>
        <Navbar></Navbar>
        <b-container>
            <b-form @submit.stop.prevent="onSubmit">
                <b-form-group id="name-input-group" label="Name" label-for="name-input">
                    <b-form-input
                        id="name-input"
                        name="name-input"
                        v-model="$v.form.name.$model"
                        :state="validateState('name')"
                        aria-describedby="name-live-feedback"
                        placeholder="Enter Name"
                    ></b-form-input>

                    <b-form-invalid-feedback id="name-live-feedback">This is a required field.</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="email-input-group" label="Email" label-for="email-input">
                    <b-form-input
                        id="email-input"
                        name="email-input"
                        v-model="$v.form.email.$model"
                        :state="validateState('email')"
                        aria-describedby="email-live-feedback"
                        placeholder="Enter Email"
                    ></b-form-input>

                    <b-form-invalid-feedback id="email-live-feedback">This is a required field and must be an email.</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="password-input-group" label="Password" label-for="password-input">
                    <b-form-input
                        id="password-input"
                        name="password-input"
                        type="password"
                        v-model="$v.form.password.$model"
                        :state="validateState('password')"
                        aria-describedby="password-live-feedback"
                        placeholder="Enter Password"
                    ></b-form-input>

                    <b-form-invalid-feedback id="password-live-feedback">This is a required field.</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="city-input-group" label="City" label-for="city-input">
                    <b-form-input
                        id="city-input"
                        name="city-input"
                        v-model="$v.form.city.$model"
                        :state="validateState('city')"
                        placeholder="Enter City"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="country-input-group" label="Country" label-for="city-input">
                    <b-form-input
                        id="country-input"
                        name="country-input"
                        v-model="$v.form.country.$model"
                        :state="validateState('country')"
                        placeholder="Enter Country"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="image-input-group" label="Upload Image" label-for="image-input">
                    <b-form-file
                        id="image-input"
                        name="image-input"
                        v-model="$v.form.image.$model"
                        :state="validateState('image')"
                    ></b-form-file>
                </b-form-group>

                <b-button type="submit" variant="primary">Submit</b-button>
            </b-form>
        </b-container>
    </div>
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { required, email } from "vuelidate/lib/validators";
    import Navbar from './Navbar.vue';

    export default {
        components: {
            Navbar
        },
        mixins: [validationMixin],
        data() {
            return {
                form: {
                    name: null,
                    email: null,
                    password: null,
                    city: null,
                    country: null,
                    image: null
                }
            };
        },
        validations: {
            form: {
                name: {
                    required
                },
                email: {
                    required,
                    email
                },
                password: {
                    required
                },
                city: {},
                country: {},
                image: {}
            }
        },
        methods: {
            validateState(name) {
                const { $dirty, $error } = this.$v.form[name];
                return $dirty ? !$error : null;
            },
            onSubmit() {
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                    return;
                }

                this.axios.post('http://localhost:4941/api/v1/users/register', {
                    "name": this.form.name,
                    "email": this.form.email,
                    "password": this.form.password,
                    "city": this.form.city,
                    "country": this.form.country
                })
                .then((res) => {
                    // Log them in
                    this.axios.post('http://localhost:4941/api/v1/users/login', {
                        "email": this.form.email,
                        "password": this.form.password
                    })
                    .then((res2) => {
                        this.$cookies.set('Token', res2.data.token, '2h');
                        this.$cookies.set('UserId', res2.data.userId, '2h');

                        if (this.form.image) {
                            let userId = res.data.userId;
                            this.axios.put('http://localhost:4941/api/v1/users/' + userId + '/photo', this.form.image, {
                                headers: {
                                    'Content-Type': this.form.image.type,
                                    'X-Authorization': this.$getLoggedInToken()
                                }
                            })
                            .then((res3) => {
                                this.$router.push('/');
                            })
                            .catch(err3 => alert(err3));
                        } else {
                            this.$router.push('/');
                        }
                    })
                    .catch(err2 => {
                        alert(err2);
                    });
                })
                .catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>
