import { useRouter } from "next/router";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { api, URLS } from "../../../api";
import {
  ConfirmBoughtModal,
  ItemBoughtErrorModal,
  ItemDetailCard,
  MainLayout,
  Modal,
} from "../../../components";
import {
  EMAIL_NOT_VERIFIED,
  FREE_NFT_DUPLICATE,
  ITEM_DUPLICATE,
  NO_AVALIBLE_NFTS,
} from "../../../components/modals/ItemBoughtErrorModal/data";
import { Meta } from "../../../container";
import { useActionElement, useRedux } from "../../../hooks";
import {
  getItemDuplicateByIdAsync,
  selectBoughtError,
  selectIsAuth,
  selectLoading,
  selectUserData,
  storeActions,
} from "../../../redux";
import { StoreItem, User } from "../../../types";
import s from "./Item.module.scss";

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;

  try {
    const res = await api.get(`${URLS.itemById.replace("<id>", `${id}`)}`);

    if (!res) {
      return {
        notFound: true,
      };
    }

    return {
      props: { item: { ...res?.data }, id },
    };
  } catch (error) {
    return {
      props: { item: {}, id },
    };
  }
};

type ItemProps = { item: StoreItem; id: string };

const Item = (props: ItemProps) => {
  const { item, id } = props;
  const { query, asPath } = useRouter();

  const [select, dispatch] = useRedux();

  const loading = select(selectLoading);
  const user: User = select(selectUserData);
  const error: string | null = select(selectBoughtError);
  const isAuth: boolean | null = select(selectIsAuth);

  const {
    itemForBuy,
    card,
    modalsState,
    waitingPayment,
    buyWithStripe,
    buyWithWallet,
    setCard,
    handleBuyClick,
    onBuyAnywayClick,
    handleAllCancel,
  } = useActionElement({ type: "Item" });

  const { setError, setDuplicateItem } = storeActions;

  useEffect(() => {
    if (!isAuth) {
      dispatch(setDuplicateItem(null));
      return;
    } else dispatch(getItemDuplicateByIdAsync(query.id as string));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.id, isAuth]);

  const handleCloseWarningModal = () => {
    dispatch(setError(null));
    handleAllCancel();
  };

  return (
    <div className={s.container}>
      <Meta
        title={item?.name}
        description=""
        image={item?.logo_preview}
        url={`${process.env.NEXT_PUBLIC_DOMAIN}${asPath}`}
      />
      {!loading && item ? (
        <ItemDetailCard
          userId={user.id}
          itemId={id}
          item={item}
          name={item?.name}
          handleOnBuyClick={handleBuyClick}
          type="item"
        />
      ) : (
        <div className={s.spiner}>
          <ClipLoader color={"#fff"} size={60} />
        </div>
      )}
      {modalsState.duplicate && (
        <ItemBoughtErrorModal
          error={ITEM_DUPLICATE}
          onCancelClick={handleAllCancel}
          onBuyClick={onBuyAnywayClick}
        />
      )}

      {modalsState.buy && (
        <Modal isCloseBtnHidden={true}>
          <ConfirmBoughtModal
            item={itemForBuy}
            handleCard={setCard}
            handleNevermindClick={handleAllCancel}
            buyWithStripe={buyWithStripe}
            buyWithWallet={buyWithWallet}
            waitingPayment={waitingPayment}
            card={card}
          />
        </Modal>
      )}
      {(error === EMAIL_NOT_VERIFIED ||
        error === NO_AVALIBLE_NFTS ||
        error === FREE_NFT_DUPLICATE) && (
        <ItemBoughtErrorModal
          error={error}
          onCancelClick={handleCloseWarningModal}
        />
      )}
    </div>
  );
};

Item.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default Item;
