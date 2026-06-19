import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-publicaciones',
  imports: [],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones {
    posts = [
        {
            id: 1,
            title: "Nuevo riff terminado 🎸",
            message: "Después de horas, por fin salió este tema!",
            image: "/guitar-2925274_640.jpg",
            likes: 23,
            comments: [
                {
                    id: 0,
                    contenido: "Muy buena guitarra."
                },
                {
                    id: 1,
                    contenido: "Felicidades amigo."
                }
            ]
        },
        {
            id: 2,
            title: "Ensayo con la banda",
            message: "Sonó brutal el ensayo de hoy 🔥",
            image: "/music-band-rehearsing-in-a-music-venue-practising-for-concert-photo.jpg",
            likes: 10,
            comments: [
                {
                    id: 0,
                    contenido: "Sigan asi que van a progresar mucho."
                }
            ]
        }
    ];


    like(post: any) {
        post.likes++;
    }

    // addComment(post: any, text: string) {
    //     if (!text.trim()) return;
    //     post.comments.push(text);
    // }

    addComment(post: any) {
    }
}
