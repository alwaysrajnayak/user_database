import mongoose, { Schema, Document } from "mongoose";

interface Geo {
  lat: string;
  lng: string;
}

const GeoSchema = new Schema<Geo>({
  lat: { type: String, required: true },
  lng: { type: String, required: true },
});

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

const AddressSchema = new Schema<Address>({
  street: { type: String, required: true },
  suite: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: String, required: true },
  geo: { type: GeoSchema, required: true },
});

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

const CompanySchema = new Schema<Company>({
  name: { type: String, required: true },
  catchPhrase: { type: String, required: true },
  bs: { type: String, required: true },
});

interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
  posts: mongoose.Types.ObjectId[]; // reference to Post documents
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: AddressSchema, required: true },
  phone: { type: String, required: true },
  website: { type: String, required: true },
  company: { type: CompanySchema, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
