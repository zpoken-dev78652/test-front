import { useRouter } from "next/router";
import { api, URLS } from "../../../api";
import {
  ItemBoughtErrorModal,
  ItemDetailCard,
  MainLayout,
} from "../../../components";
import {
  DELETE_LISTING,
  ITEM_DUPLICATE,
} from "../../../components/modals/ItemBoughtErrorModal/data";
import { errors, Routes } from "../../../constants";
import { Meta } from "../../../container";
import { transformPrice } from "../../../helpers";
import { useActionElement, useRedux } from "../../../hooks";
import {
  deleteOffer,
  selectBalance,
  selectChronicleTradeById,
  selectChronicleTradeStatus,
  selectUserData,
  tradeActions,
  TypeTrade,
} from "../../../redux";
import { BalanceCurrency, ItemDetail, User } from "../../../types";

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;

  try {
    const res = await api.get(`${URLS.offersById.replace("<id>", `${id}`)}`);

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

type ItemProps = { item: ItemDetail; id: string };

const Item = (props: ItemProps) => {
  const { item, id } = props;

  const { push } = useRouter();
  const [select, dispatch] = useRedux();

  const { setError } = tradeActions;
  const user: User = select(selectUserData);
  const tradeItem = select(selectChronicleTradeById);
  const balance = select(selectBalance);
  const { error, loading }: Partial<TypeTrade> = select(
    selectChronicleTradeStatus
  );

  const {
    itemForBuy,
    modalsState,
    handleBuyClick,
    handleAllCancel,
    onBuyAnywayClick,
    buyWithWallet,
  } = useActionElement({ type: "Offer" });

  const handleCloseWarningModal = () => {
    dispatch(setError(null));
  };

  const handleRemoveClick = () => {
    dispatch(setError(null));
    dispatch(deleteOffer(item));
  };

  if (tradeItem && !tradeItem?.seller_id) {
    push(Routes.TRADE);
  }

  const nItem = tradeItem || item;

  return (
    <div>
      <Meta
        title={item?.name}
        description={item.description}
        image={item?.logo_preview}
      />

      {nItem && (
        <ItemDetailCard
          item={nItem}
          name={nItem?.item_name}
          itemId={id}
          userId={user.id}
          type="trade"
          handleOnBuyClick={handleBuyClick}
        />
      )}

      {error === DELETE_LISTING && (
        <ItemBoughtErrorModal
          error={error}
          onCancelClick={handleCloseWarningModal}
          onBuyClick={handleRemoveClick}
        />
      )}

      {modalsState.duplicate && (
        <ItemBoughtErrorModal
          error={ITEM_DUPLICATE}
          onCancelClick={handleAllCancel}
          onBuyClick={onBuyAnywayClick}
        />
      )}

      {modalsState.buy && (
        <ItemBoughtErrorModal
          text={
            <>
              You are now depositing{" "}
              <span className={itemForBuy?.default_price?.currency}>
                {itemForBuy?.default_price?.currency}
              </span>{" "}
              {transformPrice(itemForBuy?.default_price?.value)} for this
              purchase from your Chronicle wallet. Your current balance is{" "}
              <span className={itemForBuy?.default_price?.currency}>
                {itemForBuy?.default_price?.currency}
              </span>{" "}
              {transformPrice(
                balance[itemForBuy?.default_price?.currency as BalanceCurrency]
              )}
              . Are you sure you want to continue?
            </>
          }
          error={errors.CONFIRM_OFFERS}
          onCancelClick={handleAllCancel}
          onBuyClick={buyWithWallet}
          loading={loading}
        />
      )}
    </div>
  );
};

Item.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

export default Item;
