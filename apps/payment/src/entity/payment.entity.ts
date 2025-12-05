import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Orders {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  number: string;

  @Column()
  fileId: string;

  @Column()
  orderId: string;

  @Column()
  price: string;

  @Column()
  currency: string;

  @Column()
  entity: string;

  @Column()
  receipt: string;

  @Column({ default: false })
  paid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];
}

/* export class Payments {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  orderId: string;

  @Column()
  paymentId: string;

  @Column()
  razorpaySignature: string;

  @Column()
  paymentMethod: string;

  @Column()
  currency: string;

  @Column({ type: "json" })
  customer: any;

  @Column({ type: "json" })
  notify: any;

  @Column()
  status: string;

  @Column({ type: "json" })
  rawResponse: any;

  @Column()
  shortUrl: string;

  @Column()
  paidAt: string;

  @Column()
  payment_paidId: string;

  @Column()
  invoiceId: string;

  @Column()
  method: string;

  @Column({ type: "json" })
  customer_Payment_Method_Details: any;

  @Column({ type: "json" })
  transactionDetails: any;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
} */

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /** Reference to our internal order record */
  @ManyToOne(() => Orders, (order) => order.payments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "orderId" }) // sets FK column name
  order: Orders;

  // actual FK column
  @Column("uuid")
  orderId: string;

  /** Razorpay returned fields */
  @Column({ nullable: true })
  razorpayPaymentId: string; // example: pay_Lg83hJ...

  @Column({ nullable: true })
  razorpay_Confirmation_PaymentId: string; // example: pay_Lg83hJ...

  @Column({ nullable: true })
  razorpayOrderId: string; // example: order_Lf93hF...

  @Column({ nullable: true })
  status: string; // created, captured, failed, refunded

  @Column({ nullable: true })
  method: string; // card, upi, wallet...

  @Column({ type: "decimal", nullable: true })
  amount: number;

  @Column({ nullable: true })
  currency: string;

  /** Useful extracted structured fields */
  @Column({ type: "json", nullable: true })
  customer: any; // name/email/contact only if needed

  /** Full Razorpay Response for future validation/debugging */
  @Column({ type: "json", nullable: true })
  rawPaymentResponse: any;

  @Column({ type: "json", nullable: true })
  rawPaymentSuccessResponse: any;

  /** Timestamps */
  @Column({ nullable: true })
  paidAt: string;

  @Column({ type: "json", nullable: true })
  transactionDetails: any;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: string;
}
