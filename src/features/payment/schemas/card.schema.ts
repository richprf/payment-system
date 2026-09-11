import { z } from "zod";
import { detectCardBrand, getBrandMeta, isValidLengthForBrand } from "../utils/cardType";
import { isExpiryValid } from "../utils/format";
import { digitsOnly, luhnCheck } from "../utils/luhn";

export const cardFormSchema = z
  .object({
    holderName: z
      .string()
      .trim()
      .min(3, "نام دارنده کارت حداقل ۳ کاراکتر باشد.")
      .max(64, "نام دارنده کارت بیش از حد طولانی است.")
      .regex(/^[\p{L}\s.'-]+$/u, "فقط حروف و فاصله مجاز است."),
    number: z
      .string()
      .refine((value) => digitsOnly(value).length >= 13, "شماره کارت ناقص است.")
      .refine((value) => luhnCheck(value), "شماره کارت معتبر نیست (الگوریتم Luhn)."),
    expiry: z
      .string()
      .regex(/^\d{2}\/\d{2}$/, "تاریخ را به صورت ماه/سال وارد کنید.")
      .refine((value) => isExpiryValid(value), "تاریخ انقضا گذشته یا نامعتبر است."),
    cvv: z.string().regex(/^\d{3,4}$/, "کد CVV باید ۳ یا ۴ رقم باشد."),
    saveCard: z.boolean(),
  })
  .superRefine((values, ctx) => {
    const brand = detectCardBrand(values.number);
    if (!isValidLengthForBrand(values.number, brand)) {
      ctx.addIssue({
        code: "custom",
        path: ["number"],
        message: `طول شماره برای ${getBrandMeta(brand).label} صحیح نیست.`,
      });
    }
    const expectedCvv = getBrandMeta(brand).cvvLength;
    if (digitsOnly(values.cvv).length !== expectedCvv) {
      ctx.addIssue({
        code: "custom",
        path: ["cvv"],
        message: `CVV برای ${getBrandMeta(brand).label} باید ${expectedCvv} رقم باشد.`,
      });
    }
  });

export type CardFormSchema = z.infer<typeof cardFormSchema>;

export const discountCodeSchema = z
  .string()
  .trim()
  .min(3, "کد تخفیف کوتاه است.")
  .max(24, "کد تخفیف بیش از حد طولانی است.");
