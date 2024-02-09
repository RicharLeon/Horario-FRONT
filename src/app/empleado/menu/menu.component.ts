import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QrModel } from 'src/app/models/qr.interface';
import { QrServiceService } from 'src/app/services/qr-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{

qrModel: QrModel | undefined;

  constructor(private qrServices: QrServiceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const qrId = this.route.snapshot.paramMap.get('id');
    if(qrId) {
      this.getQrEmpleadoId(Number(qrId));
    }
  }


  getQrEmpleadoId(id: number): void{
    this.qrServices.getQrEmpleado(id)
    .subscribe(
      
      qr => {
        console.log(qr);
      this.qrModel = qr;
    },
    err => {
      console.log(err);
    })
  }


}
