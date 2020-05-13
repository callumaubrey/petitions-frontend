<template>
    <div>
        <Navbar></Navbar>
        <b-container>
            <div v-if="isValid">
                <b-row style="margin-bottom:10px;">
                    <b-col>
                        <h1 style="text-align:center;">{{ petition.title }}</h1>
                        <p v-if="this.isAuthor">
                            <b-dropdown id="dropdown-1" text="Actions" class="m-md-2">
                                <b-dropdown-item @click="deletePetition()">Delete</b-dropdown-item>
                                <b-dropdown-item v-if="this.closingDateInTheFuture" @click="goToEditPetition()">Edit</b-dropdown-item>
                            </b-dropdown>
                        </p>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <p v-if="this.petitionImage">
                            <b-img :src="this.petitionImage" fluid></b-img>
                        </p>
                        <p>{{ petition.description }}</p>
                    </b-col>
                    <b-col>
                        <p><b>{{ petition.signatureCount }} have signed.</b> Lets get to {{ signatureCountMax }}!</p>
                        <b-progress :value="petition.signatureCount" :max="signatureCountMax" class="mb-3"></b-progress>
                        <p v-if="this.$isLoggedIn() && !this.hasSigned && this.closingDateInTheFuture && !this.isAuthor">
                            <b-button @click="sign()">Sign this Petition</b-button>
                        </p>
                        <p v-if="this.$isLoggedIn() && this.hasSigned && this.closingDateInTheFuture && !this.isAuthor">
                            <b-button @click="removeSignature()">Remove Your Signature</b-button>
                        </p>
                        <p>
                            Started on {{ petition.createdDate }}
                        </p>
                        <p v-if="petition.closingDate">
                            <span v-if="this.closingDateInTheFuture">Closes on {{ petition.closingDate }}</span>
                            <span v-else>Closed on {{ petition.closingDate }}</span>
                        </p>
                        <p v-else>
                            No closing date
                        </p>
                        <p>
                            Started by <b-avatar :src="this.authorImage"></b-avatar> {{ petition.authorName}}
                            <span v-if="petition.authorCity || petition.authorCountry">
                                <span v-if="petition.authorCity && petition.authorCountry">
                                    From {{ petition.authorCity }}, {{ petition.authorCountry }}
                                </span>
                                <span v-else>
                                    From {{ petition.authorCity}} {{ petition.authorCountry }}
                                </span>
                            </span>
                        </p>
                        <p>Category <b>{{ petition.category }}</b></p>
                        <p>
                            <social-sharing url="https://aubreyspetitions.nz/"
                                :title="petition.title"
                                :description="petition.description"
                                quote="Vue is a progressive framework for building user interfaces."
                                hashtags="changetheworld"
                                twitter-user="petition"
                                inline-template>
                                <b-nav vertical>
                                    <b-nav-item>
                                        <network network="email">
                                            <i class="fa fa-envelope"></i> Send an email to friends
                                        </network>
                                    </b-nav-item>
                                    <b-nav-item>
                                        <network network="facebook">
                                            <i class="fa fa-facebook"></i> Send a Facebook Message
                                        </network>
                                    </b-nav-item>
                                    <b-nav-item>
                                        <network network="twitter">
                                            <i class="fa fa-twitter"></i> Tweet to your followers
                                        </network>
                                    </b-nav-item>
                                </b-nav>
                            </social-sharing>
                        </p>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-table :items="signatories" :fields="fields">
                            <template v-slot:cell(name)="data">
                                <b-avatar :src="data.item.image"></b-avatar> {{ data.item.name }}
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
            </div>
            <div v-else>
                <b-alert variant="danger" show>Invalid Petition</b-alert>
            </div>
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
                petition: null,
                petitionImage: null,
                signatories: [],
                fields: [
                    { key: "name" },
                    { key: "city" },
                    { key: "country" }
                ],
                authorImage: null,
                isAuthor: false,
                signatureCountMax: 0,
                hasSigned: false,
                closingDateInTheFuture: false,
                isValid: true
            }
        },
        mounted() {
            this.getPetition();
        },
        methods: {
            getPetition() {
                let id = this.$route.params.id;
                if (!id) return;

                this.axios.get('http://localhost:4941/api/v1/petitions/' + id)
                .then((res) => {
                    let authorId = res.data.authorId;
                    this.petition = res.data;
                    this.signatureCountMax = res.data.signatureCount + 5;
                    this.petition.createdDate = this.$getFormattedDate(this.petition.createdDate);

                    if (this.petition.closingDate) {
                        let now = new Date();
                        let closingDate = new Date(this.petition.closingDate);
                        if (closingDate > now) {
                            this.closingDateInTheFuture = true;
                        }

                        this.petition.closingDate = this.$getFormattedDate(this.petition.closingDate);
                    } else {
                        this.closingDateInTheFuture = true;
                    }
                    // Get Petition Image
                    this.$getPetitionImage(id, (petitionImage) => {
                        this.petitionImage = petitionImage;
                    });

                    // Get Author Image
                    if (authorId) {
                        this.$getUserImage(authorId, (data) => {
                            this.authorImage = data;
                        });

                        if (this.$getLoggedInToken() && authorId == this.$getLoggedInUserId()) {
                            this.isAuthor = true;
                        }
                    }

                    // Get signatories
                    if (res.data.signatureCount > 0) {
                        this.axios.get('http://localhost:4941/api/v1/petitions/' + id + '/signatures')
                        .then((res3) => {
                            for (var i = 0; i < res3.data.length; i++) {
                                let row = res3.data[i];
                                if (parseInt(res3.data[i].signatoryId) == parseInt(this.$getLoggedInUserId())) {
                                    this.hasSigned = true;
                                }

                                this.axios.get('http://localhost:4941/api/v1/users/' + res3.data[i].signatoryId + '/photo', { responseType: 'blob' })
                                .then((res4) => {
                                    let reader = new FileReader();
                                    reader.readAsDataURL(res4.data);
                                    reader.onload = () => {
                                        this.signatories.push({
                                            'name': row.name,
                                            'city': row.city,
                                            'country': row.country,
                                            'image': reader.result
                                        });
                                    }
                                })
                                .catch(err4 => {
                                    this.signatories.push({
                                        'name': row.name,
                                        'city': row.city,
                                        'country': row.country
                                    });
                                });
                            }
                        })
                        .catch(err3 => alert(err3));
                    }
                })
                .catch((err) => {
                    this.isValid = false;
                });
            },
            deletePetition() {
                if (!this.$isLoggedIn() || !this.isAuthor) return;

                if (confirm('Are you sure you want to delete this petition?')) {
                    this.axios.delete('http://localhost:4941/api/v1/petitions/' + this.$route.params.id, {
                        headers: {
                            'X-Authorization': this.$getLoggedInToken()
                        }
                    })
                    .then((res) => {
                        this.$router.push('/my-petitions');
                    })
                    .catch(err => alert(err));
                }
            },
            goToEditPetition() {
                this.$router.push('/edit-petition/' + this.$route.params.id);
            },
            sign() {
                let id = this.$route.params.id;
                this.axios.post('http://localhost:4941/api/v1/petitions/' + id + '/signatures', {}, {
                    headers: {
                        'X-Authorization': this.$getLoggedInToken()
                    }
                })
                .then((res) => {
                    this.$router.go(0);
                })
                .catch(err => alert(err));
            },
            removeSignature() {
                let id = this.$route.params.id;
                this.axios.delete('http://localhost:4941/api/v1/petitions/' + id + '/signatures', {
                    headers: {
                        'X-Authorization': this.$getLoggedInToken()
                    }
                })
                .then((res) => {
                    this.$router.go(0);
                }).catch(err => alert(err));
            }
        }
    }
</script>
