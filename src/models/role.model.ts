import { Document, model, Schema } from 'mongoose';

interface IRole extends Document {
  name: string;
  privileges: {
    resource: {
      on_user: boolean;
      on_request: boolean;
      on_budget: boolean;
      on_role: boolean;
    };
    actions: ('create' | 'read' | 'update' | 'delete' | 'approve' | 'reject')[];
  }[];
}

const RoleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
    unique: true, // Add unique index to ensure no duplicates
    enum: ['admin', 'finance', 'staff'],
  },
  privileges: [
    {
      resource: {
        on_user: {
          type: Boolean,
        },
        on_request: {
          type: Boolean,
        },
        on_budget: {
          type: Boolean,
        },
        on_role: {
          type: Boolean,
        },
      },
      actions: [
        {
          type: String,
          enum: ['create', 'read', 'update', 'delete', 'approve', 'reject'],
          default: [],
        },
      ],
    },
  ],
});

const Role = model<IRole>('Role', RoleSchema);

export default Role;
