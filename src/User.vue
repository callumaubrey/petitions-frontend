<template>
    <div>
        <Navbar></Navbar>

        <b-container>
            <div style="text-align:center;">
                <b-avatar :src="this.userImage"></b-avatar> <h3>{{ user.name }}</h3>
            </div>
            <div v-if="currentRouteName == 'ViewProfile'">
                <!-- VIEW PROFILE -->
                <b-button to="/edit-profile" style="margin-bottom:7px;">Edit Profile</b-button>
                <p>{{ user.email }}</p>
                <p>{{ user.city }}</p>
                <p>{{ user.country }}</p>
            </div>
            <div v-else>
                <!-- EDIT PROFILE -->
                <b-alert v-if="this.success" variant="success" show>{{ this.success }}</b-alert>
                <b-alert v-if="this.error" variant="danger" show>{{ this.error }}</b-alert>
                <b-alert v-if="this.warning" variant="warning" show>{{ this.warning }}</b-alert>
                <b-button to="/my-profile" style="margin-bottom:7px;">View Profile</b-button>
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

                    <b-form-group id="current-password-input-group" label="Current Password" label-for="current-password-input">
                        <b-form-input
                            id="current-password-input"
                            name="current-password-input"
                            type="password"
                            v-model="$v.form.currentPassword.$model"
                            :state="validateState('currentPassword')"
                            aria-describedby="current-password-live-feedback"
                            placeholder="Enter Password"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group id="password-input-group" label="New Password" label-for="password-input">
                        <b-form-input
                            id="password-input"
                            name="password-input"
                            type="password"
                            v-model="$v.form.password.$model"
                            :state="validateState('password')"
                            aria-describedby="password-live-feedback"
                            placeholder="Enter Password"
                        ></b-form-input>
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
            </div>
        </b-container>
    </div>
</template>

<script>
    import Navbar from './Navbar.vue';
    import { validationMixin } from "vuelidate";
    import { required, email } from "vuelidate/lib/validators";

    export default {
        components: {
            Navbar
        },
        mixins: [validationMixin],
        data() {
            return {
                user: null,
                form: null,
                dbEmail: null,
                userImage: null,
                success: null,
                error: null,
                warning: null
            }
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
                currentPassword: {},
                password: {},
                city: {},
                country: {},
                image: {}
            }
        },
        mounted() {
            this.checkAuthorizedAndGetUser();
        },
        computed: {
            currentRouteName() {
                return this.$route.name;
            }
        },
        methods: {
            validateState(name) {
                const { $dirty, $error } = this.$v.form[name];
                return $dirty ? !$error : null;
            },
            checkAuthorizedAndGetUser() {
                if (!this.$isLoggedIn()) this.$router.push('/');

                let userId = this.$getLoggedInUserId();
                this.axios.get('http://localhost:4941/api/v1/users/' + userId, {
                    headers: {
                        'X-Authorization': this.$getLoggedInToken()
                    }
                })
                .then((res) => {
                    this.user = res.data;
                    this.form = res.data;
                    this.dbEmail = res.data.email;
                    this.form.password = null;
                    this.$getUserImage(userId, (data) => {
                        this.userImage = data;
                    })
                })
                .catch(err => alert(err));
            },
            onSubmit() {
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                    return;
                }

                let data = {
                    'name': this.form.name,
                    'email': this.form.email,
                    'city': this.form.city,
                    'country': this.form.country
                };

                if (this.form.password) {
                    data['password'] = this.form.password;
                    data['currentPassword'] = this.form.currentPassword;
                }

                let userId = this.$getLoggedInUserId();
                this.axios.patch('http://localhost:4941/api/v1/users/' + userId, data, {
                    headers: {
                        'X-Authorization': this.$getLoggedInToken()
                    }
                })
                .then((res) => {
                    this.success = 'Saved';
                })
                .catch(err => {
                    if (this.dbEmail == this.form.email) {
                        this.success = 'No data changed';
                    } else {
                        this.warning = 'Email is already in use';
                    }
                });

                if (this.form.image) {
                    this.axios.put('http://localhost:4941/api/v1/users/' + userId + '/photo', this.form.image, {
                        headers: {
                            'Content-Type': this.form.image.type,
                            'X-Authorization': this.$getLoggedInToken()
                        }
                    })
                    .then((res) => {
                        this.success = 'Saved Image';
                    })
                    .catch((err) => {
                        this.error = 'Failed to save image';
                    });
                }
            }
        }
    }
</script>
