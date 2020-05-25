<template>
    <div>
        <Navbar></Navbar>
        <b-container>
            <b-table hover
                :items="petitions"
                :fields="fields"
                @row-clicked="goToPetition"
                :per-page="perPage"
                :current-page="currentPage"
            >
                <template v-slot:cell(title)="data">
                    <b-avatar :src="'http://localhost:4941/api/v1/petitions/' + data.item.petitionId + '/photo'"></b-avatar> {{ data.item.title }}
                </template>
            </b-table>

            <b-row v-if="this.petitions">
                <b-col>
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="count"
                        :per-page="perPage"
                    ></b-pagination>
                </b-col>
            </b-row>
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
                count: null,
                perPage: 10,
                currentPage: 1
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
                    this.petitions = res.data;
                    this.count = res.data.length;
                })
                .catch((err) => alert(err));
            },
            goToPetition(item, index, event) {
                this.$router.push('/petitions/' + item.petitionId);
            }
        }
    }
</script>
