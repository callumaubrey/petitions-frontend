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
                let authorId = this.$getLoggedInUserId();
                this.axios.get('http://localhost:4941/api/v1/petitions', {
                    params: {
                        'authorId': authorId
                    }
                })
                .then((res) => {
                    for (var i = 0; i < res.data.length; i++) {
                        let row = res.data[i];
                        this.axios.get('http://localhost:4941/api/v1/petitions/' + row.petitionId + '/photo', { responseType: 'blob' })
                        .then((res2) => {
                            let reader = new FileReader();
                            reader.readAsDataURL(res2.data);
                            reader.onload = () => {
                                this.petitions.push({
                                    'petitionId': row.petitionId,
                                    'title': row.title,
                                    'category': row.category,
                                    'authorName': row.authorName,
                                    'signatureCount': row.signatureCount,
                                    'image': reader.result
                                });
                            }
                        })
                        .catch(err2 => {
                            this.petitions.push({
                                'petitionId': row.petitionId,
                                'title': row.title,
                                'category': row.category,
                                'authorName': row.authorName,
                                'signatureCount': row.signatureCount
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
