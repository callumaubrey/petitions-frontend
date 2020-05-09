import Home from './Home.vue';
import Login from './Login.vue';
import ViewPetition from './Petition.vue';
import ManagePetition from './ManagePetition.vue';
import CreatePetition from './CreatePetition.vue';
import EditPetition from './EditPetition';
import User from './User.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/my-petitions', component: ManagePetition },
    { path: '/petitions/:id', component: ViewPetition },
    { path: '/edit-petition/:id', component: EditPetition },
    { path: '/start-a-petition', component: CreatePetition },
    { path: '/my-profile', component: User, name: 'ViewProfile' },
    { path: '/edit-profile', component: User, name: 'EditProfile' }
];

export default routes;
