import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageServiceFactory, PrivateMessage } from 'src/app/shared';

@Component({
    selector: 'app-message-compose',
    templateUrl: './message-compose.component.html',
    styleUrls: ['./message-compose.component.scss']
})
export class MessageComposeComponent implements OnInit {
    private messageForm: FormGroup;
    private isInvalidUser = false;

    constructor(private afa: AngularFireAuth, private afs: AngularFirestore, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        // Setup the message composition form
        this.messageForm = new FormGroup({
            recipientId: new FormControl(null, Validators.required),
            subject: new FormControl(null, Validators.required),
            message: new FormControl(null, Validators.required)
        });
    }

    onSubmit(): void {
        let newMessage: PrivateMessage;

        // Get the form
        newMessage = this.messageForm.value;

        // Set the metadata
        newMessage.id = -1 + '';
        newMessage.senderId = this.afa.auth.currentUser.uid;
        this.afs
            .collection('users')
            .ref.where('displayName', '==', newMessage.recipientId)
            .get()
            .then(result => {
                result.forEach(doc => {
                    newMessage.recipientId = doc.data().uid;
                });
            })
            .then(() => {
                // Send the message
                MessageServiceFactory.CreateMessageService('User Message', this.afa, this.afs)
                    .sendMessage(newMessage)
                    .then(() => this.router.navigate(['..'], { relativeTo: this.route }))
                    .catch(() => (this.isInvalidUser = true));
            });
    }

    getForm(): FormGroup {
        return this.messageForm;
    }

    getIsInvalidUser(): boolean {
        return this.isInvalidUser;
    }

    // Navigate up one level
    onCancel(): void {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
