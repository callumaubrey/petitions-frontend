<template>
    <div>
        <Navbar></Navbar>

        <b-container>
            <div style="text-align:center;">
                <b-avatar :src="this.userImage"></b-avatar> <h3>{{ this.userName }}</h3>
            </div>

            <b-card no-body>
                <b-tabs pills card vertical>
                    <b-tab title="General" active>
                        <b-card-text>General</b-card-text>

                        <b-alert v-if="this.generalForm.success" variant="success" show>{{ this.generalForm.success }}</b-alert>
                        <b-alert v-if="this.generalForm.error" variant="danger" show>{{ this.generalForm.error }}</b-alert>

                        <b-form @submit.stop.prevent="onSubmitGeneral">
                            <b-form-group id="name-input-group" label="Name" label-for="name-input">
                                <b-form-input
                                    id="name-input"
                                    name="name-input"
                                    v-model="$v.generalForm.name.$model"
                                    :state="validateStateGeneral('name')"
                                    aria-describedby="name-live-feedback"
                                    placeholder="Enter Name"
                                ></b-form-input>

                                <b-form-invalid-feedback id="name-live-feedback">This is a required field.</b-form-invalid-feedback>
                            </b-form-group>

                            <b-form-group id="email-input-group" label="Email" label-for="email-input">
                                <b-form-input
                                    id="email-input"
                                    name="email-input"
                                    v-model="$v.generalForm.email.$model"
                                    :state="validateStateGeneral('email')"
                                    aria-describedby="email-live-feedback"
                                    placeholder="Enter Email"
                                ></b-form-input>

                                <b-form-invalid-feedback id="email-live-feedback">This is a required field and must be an email.</b-form-invalid-feedback>
                            </b-form-group>

                            <b-form-group id="city-input-group" label="City" label-for="city-input">
                                <b-form-input
                                    id="city-input"
                                    name="city-input"
                                    v-model="$v.generalForm.city.$model"
                                    :state="validateStateGeneral('city')"
                                    placeholder="Enter City"
                                ></b-form-input>
                            </b-form-group>

                            <b-form-group id="country-input-group" label="Country" label-for="city-input">
                                <b-form-input
                                    id="country-input"
                                    name="country-input"
                                    v-model="$v.generalForm.country.$model"
                                    :state="validateStateGeneral('country')"
                                    placeholder="Enter Country"
                                ></b-form-input>
                            </b-form-group>

                            <b-button type="submit" variant="primary">Submit</b-button>
                        </b-form>

                    </b-tab>
                    <b-tab title="Profile Photo">
                        <b-card-text>Profile Photo</b-card-text>

                        <b-alert v-if="this.imageForm.success" variant="success" show>{{ this.imageForm.success }}</b-alert>
                        <b-alert v-if="this.imageForm.error" variant="danger" show>{{ this.imageForm.error }}</b-alert>

                        <div v-if="this.userImage">
                            <b-form-group id="image-remove-input_group" label="Current Image" v-if="this.userImage">
                                <b-avatar :src="this.userImage"></b-avatar> <b-button @click="removeImage()">Remove</b-button>
                            </b-form-group>
                        </div>

                        <b-form-group id="image-input-group" label="Upload Image" label-for="image-input">
                            <b-form-file
                                id="image-input"
                                name="image-input"
                                v-model="$v.imageForm.image.$model"
                                :state="validateImage()"
                                aria-describedby="image-live-feedback"
                            ></b-form-file>
                            <b-form-invalid-feedback id="image-live-feedback">Image must be either a JPEG, PNG or GIF.</b-form-invalid-feedback>
                        </b-form-group>
                        <b-button @click="changeImage()">Change</b-button>
                    </b-tab>
                    <b-tab title="Password">
                        <b-card-text>Password</b-card-text>

                        <b-alert v-if="this.passwordForm.success" variant="success" show>{{ this.passwordForm.success }}</b-alert>
                        <b-alert v-if="this.passwordForm.error" variant="danger" show>{{ this.passwordForm.error }}</b-alert>

                        <b-form-group id="current-password-input-group" label="Current Password" label-for="current-password-input">
                            <b-form-input
                                id="current-password-input"
                                name="current-password-input"
                                type="password"
                                v-model="$v.passwordForm.currentPassword.$model"
                                :state="validateStatePassword('currentPassword')"
                                aria-describedby="current-password-live-feedback"
                                placeholder="Enter Password"
                            ></b-form-input>
                            <b-form-invalid-feedback id="current-password-live-feedback">This is a required field and must be your current password.</b-form-invalid-feedback>
                        </b-form-group>

                        <b-form-group id="password-input-group" label="New Password" label-for="password-input">
                            <b-form-input
                                id="password-input"
                                name="password-input"
                                type="password"
                                v-model="$v.passwordForm.password.$model"
                                :state="validateStatePassword('password')"
                                aria-describedby="password-live-feedback"
                                placeholder="Enter Password"
                            ></b-form-input>
                            <b-form-invalid-feedback id="password-live-feedback">This is a required field.</b-form-invalid-feedback>
                        </b-form-group>

                        <b-button @click="changePassword()">Change Password</b-button>
                    </b-tab>
                </b-tabs>
            </b-card>
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
                userId: null,
                userImage: null,
                userName: null,
                dbEmail: null,
                generalForm: {
                    name: null,
                    email: null,
                    city: null,
                    country: null,
                    success: null,
                    error: null
                },
                imageForm: {
                    image: null,
                    error: null,
                    success: null
                },
                passwordForm: {
                    password: null,
                    currentPassword: null,
                    error: null,
                    success: null
                }
            }
        },
        validations: {
            generalForm: {
                name: {
                    required
                },
                email: {
                    required,
                    email
                },
                city: {},
                country: {}
            },
            imageForm: {
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
                }
            },
            passwordForm: {
                password: {
                    required
                },
                currentPassword: {
                    required
                }
            }
        },
        mounted() {
            this.checkAuthorizedAndGetUser();
        },
        methods: {
            validateStateGeneral(name) {
                const { $dirty, $error } = this.$v.generalForm[name];
                return $dirty ? !$error : null;
            },
            validateImage() {
                const { $dirty, $error } = this.$v.imageForm['image'];
                return $dirty ? !$error : null;
            },
            validateStatePassword(name) {
                const { $dirty, $error } = this.$v.passwordForm[name];
                return $dirty ? !$error : null;
            },
            checkAuthorizedAndGetUser() {
                if (!this.$isLoggedIn()) this.$router.push('/');

                this.userId = this.$getLoggedInUserId();
                this.axios.get('http://localhost:4941/api/v1/users/' + this.userId, {
                    headers: {
                        'X-Authorization': this.$getLoggedInToken()
                    }
                })
                .then((res) => {
                    this.userName = res.data.name;
                    this.dbEmail = res.data.email;
                    this.generalForm.name = res.data.name;
                    this.generalForm.email = res.data.email;
                    this.generalForm.city = res.data.city;
                    this.generalForm.country = res.data.country;
                    this.$getUserImage(this.userId, (image) => {
                        this.userImage = image;
                    });
                })
                .catch(err => alert(err));
            },
            onSubmitGeneral() {
                this.$v.generalForm.$touch();
                if (this.$v.generalForm.$anyError) {
                    return;
                }

                this.generalForm.success = null;
                this.generalForm.error = null;

                let data = {
                    'name': this.generalForm.name,
                    'email': this.generalForm.email
                };

                if (this.generalForm.city) {
                    data['city'] = this.generalForm.city;
                }
                if (this.generalForm.country) {
                    data['country'] = this.generalForm.country;
                }

                this.axios.patch('http://localhost:4941/api/v1/users/' + this.userId, data, {
                    headers: {
                        'X-Authorization': this.$getLoggedInToken()
                    }
                })
                .then((res) => {
                    this.generalForm.success = 'Saved';
                    this.userName = this.generalForm.name;
                })
                .catch(err => {
                    if (this.dbEmail == this.generalForm.email) {
                        this.generalForm.success = 'No data changed';
                    } else {
                        this.generalForm.error = 'Email is already in use';
                    }
                });
            },
            removeImage() {
                this.imageForm.success = null;
                this.imageForm.error = null;

                this.axios.delete('http://localhost:4941/api/v1/users/' + this.userId + '/photo', {
                    headers: {
                        'X-Authorization': this.$getLoggedInToken()
                    }
                })
                .then((res) => {
                    this.imageForm.success = 'Removed Image';
                    this.userImage = null;
                })
                .catch(err => {
                    this.imageForm.error = 'Failed to remove image';
                    alert(err);
                });
            },
            changeImage() {
                this.$v.imageForm.$touch();
                if (this.$v.imageForm.$anyError) {
                    return;
                }

                this.imageForm.success = null;
                this.imageForm.error = null;

                this.axios.put('http://localhost:4941/api/v1/users/' + this.userId + '/photo', this.imageForm.image, {
                    headers: {
                        'Content-Type': this.imageForm.image.type,
                        'X-Authorization': this.$getLoggedInToken()
                    }
                })
                .then((res) => {
                    this.imageForm.success = 'Saved Image';
                    // Get the new image...
                    this.$getUserImage(this.userId, (image) => {
                        this.userImage = image;
                    })
                })
                .catch((err) => {
                    this.imageForm.error = 'Failed to save image';
                    alert(err);
                });
            },
            changePassword() {
                this.$v.passwordForm.$touch();
                if (this.$v.passwordForm.$anyError) {
                    return;
                }

                this.passwordForm.success = null;
                this.passwordForm.error = null;

                let data = {
                    'password': this.passwordForm.password,
                    'currentPassword': this.passwordForm.currentPassword
                };

                this.axios.patch('http://localhost:4941/api/v1/users/' + this.userId, data, {
                    headers: {
                        'X-Authorization': this.$getLoggedInToken()
                    }
                })
                .then((res) => {
                    this.passwordForm.success = 'Saved new password';
                })
                .catch((err) => {
                    this.passwordForm.error = 'Current password might be incorrect. Failed to save new password.';
                });
            }
        }
    }
</script>
