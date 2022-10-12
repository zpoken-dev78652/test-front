import React, { useEffect, useState } from "react";
import { Pagination } from "../../components/Pagination";
import { useRedux } from "../../hooks";
import {
  getMysteryBoxItemsById,
  selectMysteryBoxItems,
  selectUserData,
} from "../../redux";
import { MysteryBoxItem, SelectOption } from "../../types";
import s from "./UniqueMysteryBoxes.module.scss";
import Img from "../../public/img/unique.png";
import { CardModal, CustomSelect, LogoCard, Modal } from "../../components";

type UniqueMysteryBoxesProps = {
  id: string;
};

const selectes: SelectOption[] = [
  { label: 10, value: 10 },
  { label: 25, value: 25 },
  { label: 50, value: 50 },
];

export const UniqueMysteryBoxes: React.FC<UniqueMysteryBoxesProps> = ({
  id,
}) => {
  const [select, dispatch] = useRedux();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemPerPage, setItemPerPage] = useState<SelectOption>({
    label: 10,
    value: 10,
  });
  const [selectedItem, setSelectedItem] = useState<MysteryBoxItem | null>(null);

  const user = select(selectUserData);
  const mysteryBoxItems = select(selectMysteryBoxItems);

  useEffect(() => {
    dispatch(
      getMysteryBoxItemsById(id, Number(itemPerPage.value), currentPage)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, itemPerPage, currentPage]);

  const changeItemPerPage = (v: SelectOption) => setItemPerPage(v);

  const changeCurPage = (i: number) => setCurrentPage(i);

  const handleCardClick = (i: MysteryBoxItem) => () => setSelectedItem(i);

  const handleCancelClick = () => setSelectedItem(null);

  return (
    <>
      <div className={s.wrapper}>
        {mysteryBoxItems.data.length ? (
          <>
            <div className={s.cards}>
              {mysteryBoxItems.data.map((i) => (
                <div key={i.id} className={s.item} onClick={handleCardClick(i)}>
                  <LogoCard item={i} />
                </div>
              ))}
            </div>
            <div className={s.pagination}>
              <Pagination
                currentPage={currentPage}
                itemPerPage={itemPerPage}
                totalElements={mysteryBoxItems.total_results}
                totalPages={mysteryBoxItems.num_pages}
                changeStep={changeCurPage}
              />
              <div className={s.select}>
                <CustomSelect
                  theme="crypto"
                  options={selectes}
                  value={itemPerPage}
                  onChange={changeItemPerPage}
                />
              </div>
              <div className={s.selectDesc}>View on the page</div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {selectedItem && (
        <Modal onClose={handleCancelClick}>
          <CardModal data={selectedItem} userId={user.id} />
        </Modal>
      )}
    </>
  );
};
