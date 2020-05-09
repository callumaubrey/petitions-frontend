<template>
    <div>
    <Navbar></Navbar>
    <b-container>
        <div>
            <b-form @submit.stop.prevent="search" inline style="margin-bottom:10px;">
                <b-form-input v-model="form.query" placeholder="Search.."></b-form-input>
                <b-button type="submit" variant="primary">Search</b-button>
            </b-form>
            <b-table hover
                :fields="fields"
                :items="petitions"
                id="petitions"
                :per-page="perPage"
                :current-page="currentPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                @row-clicked="goToPetition"
            >
            </b-table>
            <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="petitions"
            ></b-pagination>
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
                sortBy: 'title',
                sortDesc: false,
                perPage: 10,
                currentPage: 1,
                petitions: [],
                fields: [
                    { key: 'petitionId', sortable: false },
                    { key: 'title', sortable: false },
                    { key: 'category', sortable: false },
                    { key: 'authorName', sortable: false },
                    { key: 'signatureCount', sortable: true }
                ],
                form: {
                    query: null
                },
                selectedSort: 'SIGNATURES_ASC',
                sortOptions: [
                    { value: 'ALPHABETICAL_ASC', text: 'Title ASC' },
                    { value: 'ALPHABETICAL_DESC', text: 'Title DESC' },
                    { value: 'SIGNATURES_ASC', text: 'Signatures ASC' },
                    { value: 'SIGNATURES_DESC', text: 'Signatures DESC' }
                ]
            }
        },
        mounted() {
            this.fillPetitions()
        },
        methods: {
            goToPetition(item, index, event) {
                this.$router.push('/petitions/' + item.petitionId);
            },
            fillPetitions() {
                this.axios.get('http://localhost:4941/api/v1/petitions')
                .then((res) => {
                    this.petitions = res.data;
                })
                .catch(err => alert(err));
            },
            search() {
                if (this.form.query == null || this.form.query === '') {
                    // Reset to all
                    this.fillPetitions();
                }

                this.axios.get('http://localhost:4941/api/v1/petitions?q=' + this.form.query + '&sort=' + this.selectedSort)
                .then((res) => {
                    this.petitions = res.data;
                })
                .catch(err => alert(err));
            }
        },
        computed: {
            rows() {
                 return this.petitions.length;
            }
        }
    }
</script>
