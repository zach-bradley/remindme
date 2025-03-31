
export interface UserLocation {
    latitude: GLfloat;
    longitude: GLfloat;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    location: UserLocation;
}

