<template>
    <div>
        <Navbar></Navbar>
        <b-container>
            <b-alert v-if="form.error" show variant="warning"> {{ form.error }}</b-alert>
            <b-form @submit.stop.prevent="onSubmit">
                <b-form-group id="email-input-group" label="Email" label-for="email-input">
                    <b-form-input
                        id="email-input"
                        name="email-input"
                        v-model="$v.form.email.$model"
                        :state="validateState('email')"
                        aria-describedby="email-live-feedback"
                        placeholder="Enter email"
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
                    error: null,
                    email: null,
                    password: null
                }
            };
        },
        validations: {
            form: {
                email: {
                    required,
                    email
                },
                password: {
                    required
                }
            }
        },
        methods: {
            validateState(name) {
                const { $dirty, $error } = this.$v.form[name];
                return $dirty ? !$error : null;
            },
            checkLoggedIn() {
                if (this.$isLoggedIn()) {
                    this.$router.push('/');
                }
            },
            onSubmit() {
                this.form.error = null;
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                    return;
                }

                this.axios.post('http://localhost:4941/api/v1/users/login', {
                    "email": this.form.email,
                    "password": this.form.password
                })
                .then((res) => {
                    this.$cookies.set('Token', res.data.token, '2h');
                    this.$cookies.set('UserId', res.data.userId, '2h');
                    this.$router.push('/');
                })
                .catch((err) => {
                    this.form.error = 'Invalid email or password';
                });
            }
        },
        mounted() {
            this.checkLoggedIn();
        }
    };
</script>
