import React, { useRef, useEffect } from 'react';
import useDimensions from '@hooks/useDimensions';

interface BottomSheetMetircs {
  touchStart: {
    sheetY: number;
    touchY: number;
  };
  touchMove: {
    prevTouchY: number;
    movingDirection: 'none' | 'down' | 'up';
  };
  isContentAreaTouched: boolean; // 컨텐츠 영역을 터치하고 있음을 기록
}

export const useBottomSheet = () => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const metrics = useRef<BottomSheetMetircs>({
    touchStart: {
      sheetY: 0,
      touchY: 0,
    },
    touchMove: {
      prevTouchY: 0,
      movingDirection: 'none',
    },
    isContentAreaTouched: false,
  });

  const { height } = useDimensions();

  const size = {
    minY: 60,
    maxY: height && height - 80, // 바텀시트가 최소로 내려갔을 때의 y 값
  };

  useEffect(() => {
    const canUserMoveBottomSheet = () => {
      const { touchMove, isContentAreaTouched } = metrics.current;
      if (isContentAreaTouched) {
        return true;
      }
      // 바텀시트가 올라와있는 상태가 아닐 때는 컨텐츠 영역을 터치해도 바텀시트를 움직이는 것이 자연스럽다.
      if (sheetRef.current && contentRef.current) {
        if (sheetRef.current.getBoundingClientRect().y !== size.minY) {
          return true;
        }
        // 스크롤을 더 이상 올릴 것이 없다면, 바텀시트를 움직이는 것이 자연스럽다.
        // Safari 에서는 bounding 효과 때문에 scrollTop 이 음수가 될 수 있습니다. 따라서 0보다 작거나 같음 (<=)으로 검사합니다.
        if (touchMove.movingDirection === 'down') {
          return contentRef.current?.scrollTop <= 0;
        }
      }
      return false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (metrics.current && sheetRef.current) {
        const { touchStart } = metrics.current;
        touchStart.sheetY = sheetRef.current.getBoundingClientRect().y;
        touchStart.touchY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (metrics.current && sheetRef.current) {
        const { touchStart, touchMove } = metrics.current;
        const currentTouch = e.touches[0];
        if (touchMove.prevTouchY === undefined) {
          touchMove.prevTouchY = touchStart.touchY;
        }
        if (touchMove.prevTouchY < currentTouch.clientY) {
          touchMove.movingDirection = 'down';
        }
        if (touchMove.prevTouchY > currentTouch.clientY) {
          touchMove.movingDirection = 'up';
        }

        if (canUserMoveBottomSheet()) {
          // content에서 scroll이 발생하는 것을 막습니다.
          e.preventDefault();

          // 터치 시작점에서부터 현재 터치 포인트까지의 변화된 y값
          const touchOffset = currentTouch.clientY - touchStart.touchY;
          let nextSheetY = touchStart.sheetY + touchOffset;

          // nextSheetY 는 minY maxY 사이의 값으로 clamp 되어야 한다

          if (nextSheetY <= size.minY) {
            nextSheetY = size.minY;
          }

          if (size.maxY && nextSheetY >= size.maxY) {
            nextSheetY = size.maxY;
          }
          if (size.maxY) {
            sheetRef.current.style.setProperty(
              'transform',
              `translateY(${nextSheetY - size.maxY}px)`
            );
          }
        } else {
          // 컨텐츠를 스크롤하는 동안에는 body가 스크롤되는 것을 막습니다
          document.body.style.overflowY = 'hidden';
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (metrics.current && sheetRef.current) {
        document.body.style.overflowY = 'auto';
        const { touchMove } = metrics.current;

        // Snap Animation
        const currentSheetY = sheetRef.current.getBoundingClientRect().y;
        if (currentSheetY !== size.minY) {
          if (touchMove.movingDirection === 'down') {
            sheetRef.current.style.setProperty('transform', 'translateY(0)');
          }
          if (size.maxY) {
            if (touchMove.movingDirection === 'up') {
              sheetRef.current.style.setProperty(
                'transform',
                `translateY(${size.minY - size.maxY}px)`
              );
            }
          }

          metrics.current = {
            touchStart: {
              sheetY: 0,
              touchY: 0,
            },
            touchMove: {
              prevTouchY: 0,
              movingDirection: 'none',
            },
            isContentAreaTouched: false,
          };
        }
      }
    };

    if (sheetRef.current) {
      sheetRef.current.addEventListener('touchstart', handleTouchStart);
      sheetRef.current.addEventListener('touchmove', handleTouchMove);
      sheetRef.current.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (sheetRef.current) {
        sheetRef.current.removeEventListener('touchstart', handleTouchStart);
        sheetRef.current.removeEventListener('touchmove', handleTouchMove);
        sheetRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  return { sheetRef, contentRef, size, height };
};
