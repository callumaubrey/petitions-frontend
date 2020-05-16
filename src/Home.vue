<template>
    <div>
        <Navbar></Navbar>

        <b-container>
            <b-row>
                <b-col>
                    <b-form @submit.stop.prevent="getPetitions" inline style="margin-bottom:10px;">
                        <b-form-input v-model="query" placeholder="Search.."></b-form-input>
                        <b-button type="submit" variant="primary">Search</b-button>
                    </b-form>
                </b-col>
                <b-col>
                    <b-form-select v-on:change="getPetitions" v-model="selectedSort" :options="sortOptions"></b-form-select>
                </b-col>
                <b-col>
                    <b-form-select v-on:change="getPetitions" v-model="selectedCategory" :options="categories"></b-form-select>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-table hover
                        :fields="fields"
                        :items="data"
                        @row-clicked="goToPetition"
                    >
                        <template v-slot:cell(title)="data">
                            <b-avatar :src="data.item.image"></b-avatar> {{ data.item.title }}
                        </template>
                    </b-table>
                </b-col>
            </b-row>

            <b-row v-if="this.data">
                <b-col>
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="count"
                        :per-page="limit"
                        @input="getPetitions()"
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
                data: [],
                fields: [
                    { key: 'title', sortable: false },
                    { key: 'category', sortable: false },
                    { key: 'authorName', sortable: false },
                    { key: 'signatureCount', sortable: false }
                ],
                currentPage: 1,
                count: 1,
                limit: 10,
                query: '',
                selectedCategory: null,
                categories: [],
                selectedSort: 'SIGNATURES_ASC',
                sortOptions: [
                    { value: 'ALPHABETICAL_ASC', text: 'Title ASC' },
                    { value: 'ALPHABETICAL_DESC', text: 'Title DESC' },
                    { value: 'SIGNATURES_ASC', text: 'Signatures ASC' },
                    { value: 'SIGNATURES_DESC', text: 'Signatures DESC' }
                ],
            }
        },
        mounted() {
            this.getPetitions();
            this.getCategories();
        },
        methods: {
            getPetitions() {
                // Reset data
                this.data = [];

                let params = {
                    'startIndex': (this.currentPage - 1) * this.limit,
                    'count': this.limit,
                    'sortBy': this.selectedSort
                };
                if (this.query) {
                    params['q'] = this.query;
                }
                if (this.selectedCategory) {
                    params['categoryId'] = this.selectedCategory;
                }
                this.axios.get('http://localhost:4941/api/v1/petitions', {
                    params: params
                })
                .then((res) => {
                    for (let i = 0; i < res.data.length; i++) {
                        this.data.push({
                            'petitionId': res.data[i].petitionId,
                            'title': res.data[i].title,
                            'category': res.data[i].category,
                            'authorName': res.data[i].authorName,
                            'signatureCount': res.data[i].signatureCount,
                            'image': null
                        });
                        this.data.map(row => {
                            this.$getPetitionImage(row.petitionId, (image) => {
                                row.image = image;
                            });
                        });
                    }
                })
                .catch(err => alert(err));

                this.getCount();
            },
            getCount() {
                let params = {};
                if (this.query) {
                    params['q'] = this.query;
                }
                if (this.selectedCategory) {
                    params['categoryId'] = this.selectedCategory;
                }

                this.axios.get('http://localhost:4941/api/v1/petitions', {
                    params: params
                })
                .then((res) => {
                    this.count = res.data.length;
                })
                .catch(err => alert(err));
            },
            getCategories() {
                this.axios.get('http://localhost:4941/api/v1/petitions/categories')
                .then((res) => {
                    this.categories.push({ value: null, text: 'Filter by category' });
                    for (var i = 0; i < res.data.length; i++) {
                        this.categories.push({ value: res.data[i].categoryId, text: res.data[i].name });
                    }
                })
                .catch(err => alert(err));
            },
            goToPetition(item, index, event) {
                this.$router.push('/petitions/' + item.petitionId);
            }
        }
    }
</script>
