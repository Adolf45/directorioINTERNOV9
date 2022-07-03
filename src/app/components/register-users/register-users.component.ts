import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { UserInterface } from 'src/app/components/models/user';
import { UserdbService } from 'src/app/services/userdb.service';
import { AuthService } from 'src/app/services/auth.service';
import * as Notiflix from 'notiflix';
import { AngularFireAuth } from '@angular/fire/compat/auth';




@Component({
  selector: 'app-register-users',
  templateUrl: './register-users.component.html',
  styleUrls: ['./register-users.component.scss']
})
export class RegisterUsersComponent implements OnInit {
  usersForm: FormGroup;
  isAlert=false;
  alertMsg='';

  datos: UserInterface={
    id: Math.random().toString(36).substr(2,18),
    name: null,
    email: null,
    password: null,
    roles: {
      rol:null
    },
  }
  
  public email: string = '' ;
  public password: string = '';

  constructor(public authService: AuthService ,   private anguAuth:AngularFireAuth,private router:Router,  private userdb:UserdbService, public fb:FormBuilder, private toast: NgToastService ) { }


  ngOnInit(): void {
   }

  /*
  async onAddUser2(){
    const res= await this.auth2Service.registerUser2(this.datos2).catch((err) => {
        console.log('error', this.alertMsg ='La dirección de correo electrónico ya está en uso por otra cuenta.', this.isAlert=true);
      })
    if(res){ 
      console.log('Usuario creado con éxito');   
      const path= 'users';

 
   } 
  }


  onLoginRedirect2(): void {
    this.router.navigate(['register']);
  }
*/

async guardarUsuario(){


  const res= await this.authService.registerUser(this.datos).catch((err) => {
    console.log('error', this.alertMsg ='La dirección de correo electrónico ya está en uso por otra cuenta.', this.isAlert=true);
  })
if(res){ 
  console.log('Éxito al crear Usurio');   
  const path= 'users';
  const id =res.user.uid;
  this.datos.id=id;
  this.datos.password= this.datos.password
  this.datos.roles=this.datos.roles
  await this.userdb.createDoc(this.datos,path,id);
  this.anguAuth.signOut()
  this.router.navigate(['login'])
 this.authService.isAuth().subscribe(user =>{
       if(user){
            user.updateProfile({
                displayName:this.datos.name
            })
       }
 })
 
 Notiflix.Loading.standard('Cargando...')
      Notiflix.Loading.remove(2000);

  this.toast.success({detail:'Registro exitoso', position:'tr', duration:5000});
}
  

}}
