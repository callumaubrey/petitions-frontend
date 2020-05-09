<template>
    <div>
    <b-navbar class="nav-bar" fixed toggleable="lg" style="margin-bottom:10px;border-bottom: 1px solid #dbd9db;">
        <b-container>
            <b-navbar-brand to='/'>Petitions Site</b-navbar-brand>
            <b-navbar-toggle fixed target="nav-collapse" toggleable="true"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item v-if="this.$isLoggedIn()" to="/start-a-petition">Start a Petition</b-nav-item>
                    <b-nav-item v-if="this.$isLoggedIn()" to="/my-petitions">Manage</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav class="ml-auto">
                    <b-nav-item v-if="!this.$isLoggedIn()" v-b-modal.modal-login>Login</b-nav-item>
                    <b-nav-item-dropdown v-if="this.$isLoggedIn()">
                        <template v-slot:button-content>
                            <b-avatar :src="userPhoto"></b-avatar>
                        </template>
                        <b-dropdown-item to="/my-profile">Profile</b-dropdown-item>
                        <b-dropdown-item @click="logout()">Log Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-container>
    </b-navbar>

    <b-modal id="modal-login" hide-title hide-footer>
        <div style="text-align:center" v-if="!showRegisterForm">
            <h3>Login</h3>
            Don't have an account? <b-button v-if="!showRegisterForm" style="padding-left: 0;margin-top: -2.5px;" variant="link" :pressed.sync="showRegisterForm">Sign up</b-button>
        </div>
        <div style="text-align:center" v-else>
            <h3>Register</h3>
            Already have an account? <b-button v-if="showRegisterForm" style="padding-left: 0;margin-top: -2.5px;" variant="link" :pressed.sync="showRegisterForm">Login</b-button>
        </div>
        <b-alert v-if="form.error" show variant="warning" style="margin-top:10px;"> {{ form.error }}</b-alert>
        <div v-if="showRegisterForm">
            <b-form @submit.stop.prevent="submitRegister()">
                <b-form-group id="email-input-group" label="Email" label-for="email-input">
                    <b-form-input
                        id="email-input"
                        name="email-input"
                        v-model="$v.registerForm.email.$model"
                        :state="validateRegisterState('email')"
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
                        v-model="$v.registerForm.password.$model"
                        :state="validateRegisterState('password')"
                        aria-describedby="password-live-feedback"
                        placeholder="Enter Password"
                    ></b-form-input>

                    <b-form-invalid-feedback id="password-live-feedback">This is a required field.</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="name-input-group" label="Name" label-for="name-input">
                    <b-form-input
                        id="name-input"
                        name="name-input"
                        v-model="$v.registerForm.name.$model"
                        :state="validateRegisterState('name')"
                        aria-describedby="name-live-feedback"
                        placeholder="Enter Name"
                    ></b-form-input>

                    <b-form-invalid-feedback id="name-live-feedback">This is a required field.</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="city-input-group" label="City" label-for="city-input">
                    <b-form-input
                        id="city-input"
                        name="city-input"
                        v-model="$v.registerForm.city.$model"
                        :state="validateRegisterState('city')"
                        placeholder="Enter City"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="country-input-group" label="Country" label-for="city-input">
                    <b-form-input
                        id="country-input"
                        name="country-input"
                        v-model="$v.registerForm.country.$model"
                        :state="validateRegisterState('country')"
                        placeholder="Enter Country"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="image-input-group" label="Upload Image" label-for="image-input">
                    <b-form-file
                        id="image-input"
                        name="image-input"
                        v-model="$v.registerForm.image.$model"
                        :state="validateRegisterState('image')"
                        aria-describedby="image-live-feedback"
                    ></b-form-file>

                    <b-form-invalid-feedback id="image-live-feedback">Image must be a JPEG, PNG or GIF.</b-form-invalid-feedback>
                </b-form-group>
                <b-button type="submit" variant="primary" style="width:100%;">Register</b-button>
            </b-form>
        </div>
        <div v-else>
            <b-form @submit.stop.prevent="submitLogin()">
                <b-form-group id="email-input-group" label="Email" label-for="email-input">
                    <b-form-input
                        id="email-input"
                        name="email-input"
                        v-model="$v.loginForm.email.$model"
                        :state="validateLoginState('email')"
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
                        v-model="$v.loginForm.password.$model"
                        :state="validateLoginState('password')"
                        aria-describedby="password-live-feedback"
                        placeholder="Enter Password"
                    ></b-form-input>

                    <b-form-invalid-feedback id="password-live-feedback">This is a required field.</b-form-invalid-feedback>
                </b-form-group>
                <b-button type="submit" variant="primary" style="width:100%">Login</b-button>
            </b-form>
        </div>
    </b-modal>
  </div>
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { required, email } from "vuelidate/lib/validators";

    const Navbar = {
        name: 'Navbar',
        components: {},
        mixins: [validationMixin],
        data: () => {
            return {
                modalTitle: 'Login',
                name: '',
                userPhoto: '',
                showRegisterForm: false,
                form: {
                    error: null
                },
                loginForm: {
                    email: null,
                    password: null
                },
                registerForm: {
                    name: null,
                    email: null,
                    password: null,
                    city: null,
                    country: null,
                    image: null
                }
            }
        },
        validations: {
            loginForm: {
                email: {
                    required,
                    email
                },
                password: {
                    required
                }
            },
            registerForm: {
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
                image: {
                    validateImage(val) {
                        if (val === null) return true;
                        if (val.type == 'image/jpeg' || val.type == 'image/jpg' || val.type == 'image/png'
                            || val.type == 'image/gif') {
                            return true;
                        }
                        return false;
                    }
                }
            }
        },
        mounted() {
            this.fillData()
        },
        methods: {
            validateRegisterState(name) {
                const { $dirty, $error } = this.$v.registerForm[name];
                return $dirty ? !$error : null;
            },
            validateLoginState(name) {
                const { $dirty, $error } = this.$v.loginForm[name];
                return $dirty ? !$error : null;
            },
            logout() {
                if (this.$isLoggedIn()) {
                    this.axios.post('http://localhost:4941/api/v1/users/logout', {}, {
                        headers: {
                            'X-Authorization': this.$getLoggedInToken()
                        }
                    })
                    .then((res) => {
                        this.$cookies.remove('Token');
                        this.$cookies.remove('UserId');
                        window.location.href = '/';
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
            },
            submitLogin() {
                this.form.error = null;
                this.$v.loginForm.$touch();
                if (this.$v.loginForm.$anyError) {
                    return;
                }

                let data = {
                   "email": this.loginForm.email,
                   "password": this.loginForm.password
                };

                this.login(data, (success, errMsg) => {
                    if (success === false) {
                        this.form.error = errMsg;
                    } else {
                        this.$router.go(0);
                    }
                });
            },
            submitRegister() {
                this.form.error = null;
                this.$v.registerForm.$touch();
                if (this.$v.registerForm.$anyError) {
                    return;
                }
                this.register();
            },
            register() {
                let registerData = {
                    "name": this.registerForm.name,
                    "email": this.registerForm.email,
                    "password": this.registerForm.password
                };

                if (this.registerForm.city) {
                    registerData['city'] = this.registerForm.city;
                }
                if (this.registerForm.country) {
                    registerData['country'] = this.registerForm.country;
                }

                this.axios.post('http://localhost:4941/api/v1/users/register', registerData)
                .then((res) => {
                    let data = {
                       "email": this.registerForm.email,
                       "password": this.registerForm.password
                    };
                    this.login(data, (success, data) => {
                        if (this.registerForm.image && success === true) {
                            let userId = data;
                            this.axios.put('http://localhost:4941/api/v1/users/' + userId + '/photo', this.registerForm.image, {
                                headers: {
                                    'Content-Type': this.registerForm.image.type,
                                    'X-Authorization': this.$getLoggedInToken()
                                }
                            })
                            .then((res3) => {
                                this.$router.go(0);
                            })
                            .catch(err3 => alert(err3));
                        } else {
                            this.$router.go(0);
                        }
                    });
                })
                .catch(err => {
                    this.form.error = 'Email already in use';
                });
            },
            login(data, callback) {
                this.axios.post('http://localhost:4941/api/v1/users/login', data)
                .then((res) => {
                    this.$cookies.set('Token', res.data.token, '2h');
                    this.$cookies.set('UserId', res.data.userId, '2h');
                    callback(true, res.data.userId);
                })
                .catch((err) => {
                    callback(false, 'Invalid email or password');
                });
            },
            fillData() {
                if (this.$isLoggedIn()) {
                    let userId = this.$getLoggedInUserId();
                    this.axios.get('http://localhost:4941/api/v1/users/' + userId)
                    .then((res) => {
                        this.name = res.data.name;
                        this.$getUserImage(this.$getLoggedInUserId(), (data) => {
                            this.userPhoto = data;
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
            }
        }
    };
    export default Navbar;
</script>
