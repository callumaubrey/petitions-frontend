<template>
    <div>
        <Navbar></Navbar>
        <b-container>
            <b-table hover
                :items="petitions"
                :fields="fields"
                @row-clicked="goToPetition"
            >
                <template v-slot:cell(title)="data">
                    <b-avatar :src="data.item.image"></b-avatar> {{ data.item.title }}
                </template>
            </b-table>
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
                petitions: [],
                fields: [
                    { key: 'title', sortable: false },
                    { key: 'category', sortable: false },
                    { key: 'authorName', sortable: false },
                    { key: 'signatureCount', sortable: false }
                ],
            }
        },
        mounted() {
            this.checkLoggedIn();
            this.getUserPetitions();
        },
        methods: {
            checkLoggedIn() {
                if (!this.$isLoggedIn()) {
                    this.$router.push('/login');
                }
            },
            getUserPetitions() {
                this.petitions = [];
                let authorId = this.$getLoggedInUserId();
                this.axios.get('http://localhost:4941/api/v1/petitions', {
                    params: {
                        'authorId': authorId
                    }
                })
                .then((res) => {
                    for (var i = 0; i < res.data.length; i++) {
                        this.petitions.push({
                            'petitionId': res.data[i].petitionId,
                            'title': res.data[i].title,
                            'category': res.data[i].category,
                            'authorName': res.data[i].authorName,
                            'signatureCount': res.data[i].signatureCount,
                            'image': null
                        });
                        this.petitions.map(row => {
                            this.$getPetitionImage(row.petitionId, (image) => {
                                row.image = image;
                            });
                        });
                    }
                })
                .catch((err) => alert(err));
            },
            goToPetition(item, index, event) {
                this.$router.push('/petitions/' + item.petitionId);
            }
        }
    }
</script>
