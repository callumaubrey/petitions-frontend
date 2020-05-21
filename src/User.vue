<template>
    <div>
        <Navbar></Navbar>

        <b-container>
            <div style="text-align:center;">
                <b-avatar :src="this.userImage"></b-avatar> <h3>{{ user.name }}</h3>
            </div>
            <b-button to="/edit-profile" style="margin-bottom:7px;">Edit Profile</b-button>
            <p>{{ user.email }}</p>
            <p>{{ user.city }}</p>
            <p>{{ user.country }}</p>
        </b-container>
    </div>
</template>

<script>
    import Navbar from './Navbar.vue';

    export default {
        components: {
            Navbar
        },
        data() {
            return {
                user: null,
                userImage: null
            }
        },
        mounted() {
            this.checkAuthorizedAndGetUser();
        },
        methods: {
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
                    this.$getUserImage(userId, (image) => {
                        this.userImage = image;
                    });
                })
                .catch(err => alert(err));
            }
        }
    }
</script>
