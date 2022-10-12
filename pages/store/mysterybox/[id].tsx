import Link from "next/link";
import {
  ConfirmBoughtModal,
  ItemBoughtErrorModal,
  MainLayout,
  Modal,
  MysteryBoxPrice,
} from "../../../components";
import { ChevronUpIcon } from "../../../components/Icons";
import { Routes } from "../../../constants";
import {
  CommonMysteryBoxes,
  Meta,
  UniqueMysteryBoxes,
} from "../../../container";
import { api } from "../../../api";
import { MysteryBox } from "../../../types";
import { useActionElement, useRedux } from "../../../hooks";
import s from "./MysteryboxDetail.module.scss";
import { selectBoughtError } from "../../../redux";
import { PAYMENT_ERROR } from "../../../components/modals/ItemBoughtErrorModal/data";

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;

  try {
    const { data } = await api.get(`mystery_boxes/${id}`);

    return { props: { data } };
  } catch (error) {
    return {
      props: {},
    };
  }
};

type MysteryboxDetailProps = { data: MysteryBox };

const MysteryboxDetail = ({ data }: MysteryboxDetailProps) => {
  const [select] = useRedux();
  const error: string | null = select(selectBoughtError);

  const {
    itemForBuy,
    card,
    modalsState,
    waitingPayment,
    buyWithStripe,
    buyWithWallet,
    setCard,
    handleBuyClick,
    handleClosePayError,
    handleAllCancel,
    handleRetry,
  } = useActionElement({ type: "MysteryBox" });

  return (
    <>
      <div className={s.container}>
        <Meta
          title={`Mystery Box | ${data?.name}`}
          description={data?.description}
          image={data?.logo_preview}
        />
        <div className={s.container}>
          <div className={s.navigation}>
            <Link href={Routes.STORE} passHref>
              <div className={s.nav1}>
                New drops
                <span>
                  <ChevronUpIcon />
                </span>
              </div>
            </Link>
            <div className={s.nav2}>“{data?.name}” Mystery Box Details</div>
          </div>
          <div>
            <div
              className={s.header}
              style={{
                backgroundImage: `url(${data?.logo})`,
              }}
            >
              <div className={s.leftSide}>
                <p className={s.type}>
                  {data?.mystery_box_type === "unique" ? "Unique" : "Common"}{" "}
                  Mystery Box
                </p>
                <p className={s.name}>{data?.name}</p>
                <p className={s.desc}>{data?.description}</p>
              </div>
              <MysteryBoxPrice
                item={data}
                type="detail"
                handleBuyClick={handleBuyClick}
              />
            </div>
          </div>
          <div className={s.infoText}>
            <h5 className={s.title}>What&apos;s included in the box</h5>
            <p className={s.desc}>
              The following are a list of possible collectibles that you can
              obtain when purchasing an item from this mystery box, their
              original available quantities, and the odds/chances available.
            </p>
          </div>
          {data?.mystery_box_type === "unique" ? (
            <UniqueMysteryBoxes id={data?.id} />
          ) : (
            <CommonMysteryBoxes id={data?.id} />
          )}
        </div>
      </div>
      {itemForBuy && modalsState?.buy && (
        <Modal isCloseBtnHidden={true}>
          <ConfirmBoughtModal
            item={itemForBuy}
            handleCard={setCard}
            handleNevermindClick={handleAllCancel}
            buyWithStripe={buyWithStripe}
            buyWithWallet={buyWithWallet}
            waitingPayment={waitingPayment}
            card={card}
            type="MysteryBox"
          />
        </Modal>
      )}

      {(error === PAYMENT_ERROR || error === "Your card was declined.") &&
        modalsState?.error && (
          <ItemBoughtErrorModal
            error={error}
            onCancelClick={handleClosePayError}
            onBuyClick={handleRetry}
          />
        )}
    </>
  );
};

MysteryboxDetail.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default MysteryboxDetail;
