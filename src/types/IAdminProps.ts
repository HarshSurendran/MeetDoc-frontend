import { IUser } from "./IUser";

export interface IAddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUser: IUser) => Promise<void>;
}

export interface IEditUserModalProps {
  user: IUser;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: IUser) => Promise<void>;
}