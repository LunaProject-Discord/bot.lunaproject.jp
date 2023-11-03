import { CrownOutlined } from '@components/icons';
import { TranslationKeys } from '@interfaces/localization';
import { GuildRolesViewProps, GuildViewProps } from '@interfaces/view';
import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { CheckOutlined, CloseOutlined, DeleteOutlined, RemoveOutlined } from '@mui/icons-material';
import { alpha, Box, BoxProps, CSSObject, styled, Theme, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { checkPermission, getRoleColor } from '@utils/discord';
import clsx from 'clsx';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { size } from 'polished';
import React, { forwardRef, Fragment, useLayoutEffect, useRef, useState } from 'react';

const gridBorderWidth = 2;

const gridClassPrefix = 'Grid';
const gridClasses = {
    root: `${gridClassPrefix}-root`,
    column: `${gridClassPrefix}-column`,
    columnHeader: `${gridClassPrefix}-columnHeader`,
    cell: `${gridClassPrefix}-cell`,
    rowHeaderCell: `${gridClassPrefix}-rowHeaderCell`,
    columnHeaderCell: `${gridClassPrefix}-columnHeaderCell`
};

const StyledGridRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    overflowX: 'auto',
    [`& .${gridClasses.column}:not(.${gridClasses.columnHeader}):not(:last-child)`]: {
        borderRight: `solid 1px ${theme.palette.divider}`
    }
}));

const GridRoot = forwardRef<HTMLDivElement, BoxProps>(({ className, ...props }, ref) => (
    <StyledGridRoot
        ref={ref}
        className={clsx(gridClasses.root, className)}
        {...props}
    />
));
GridRoot.displayName = 'GridRoot';

const gridColumnStyled = (theme: Theme): CSSObject => ({
    display: 'flex',
    flexDirection: 'column',
    [`& .${gridClasses.cell}:not(:last-child)`]: {
        borderBottom: `solid 1px ${theme.palette.divider}`
    }
});

const GridColumn = styled(
    ({ className, ...props }: BoxProps) => (<Box className={clsx(gridClasses.column, className)} {...props} />)
)<BoxProps>(({ theme }) => gridColumnStyled(theme));

const gridColumnHeaderStyled = (theme: Theme): CSSObject => ({
    position: 'sticky',
    left: 0,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    borderRight: `solid ${gridBorderWidth}px ${theme.palette.divider}`
});

const GridColumnHeader = styled(
    ({ className, ...props }: BoxProps) => (
        <GridColumn
            className={clsx(gridClasses.columnHeader, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => gridColumnHeaderStyled(theme));

const StyledDesktopGridColumnHeader = styled(Box)(({ theme }) => ({
    ...gridColumnStyled(theme),
    ...gridColumnHeaderStyled(theme),
    zIndex: 2,
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}));

const DesktopGridColumnHeader = forwardRef<HTMLDivElement, BoxProps>(({ className, ...props }, ref) => (
    <StyledDesktopGridColumnHeader
        ref={ref}
        className={clsx(gridClasses.column, gridClasses.columnHeader, className)}
        {...props}
    />
));
DesktopGridColumnHeader.displayName = 'DesktopGridColumnHeader';

const StyledMobileGridColumnHeader = styled(Box)(({ theme }) => ({
    ...gridColumnStyled(theme),
    ...gridColumnHeaderStyled(theme),
    zIndex: 2,
    [theme.breakpoints.up('md')]: {
        display: 'none'
    }
}));

const MobileGridColumnHeader = forwardRef<HTMLDivElement, BoxProps>(({ className, ...props }, ref) => (
    <StyledMobileGridColumnHeader
        ref={ref}
        className={clsx(gridClasses.column, gridClasses.columnHeader, className)}
        {...props}
    />
));
MobileGridColumnHeader.displayName = 'MobileGridColumnHeader';

const StyledGridCell = styled(Box)(({ theme }) => ({
    minWidth: theme.spacing(8),
    minHeight: theme.spacing(6),
    display: 'flex',
    placeItems: 'center',
    placeContent: 'center',
    gap: theme.spacing(1)
}));

const GridCell = forwardRef<HTMLDivElement, BoxProps>(({ className, ...props }, ref) => (
    <StyledGridCell
        ref={ref}
        className={clsx(gridClasses.cell, className)}
        {...props}
    />
));
GridCell.displayName = 'GridCell';

const StyledGridRowHeaderCell = styled(StyledGridCell)(({ theme }) => ({
    maxWidth: 300,
    paddingRight: theme.spacing(1),
    placeItems: 'initial',
    placeContent: 'initial',
    alignItems: 'center'
}));

const GridRowHeaderCell = forwardRef<HTMLDivElement, BoxProps>(({ className, ...props }, ref) => (
    <StyledGridRowHeaderCell
        ref={ref}
        className={clsx(gridClasses.cell, gridClasses.rowHeaderCell, className)}
        {...props}
    />
));
GridRowHeaderCell.displayName = 'GridRowHeaderCell';

const StyledGridColumnHeaderCell = styled(StyledGridCell)(({ theme }) => ({
    padding: theme.spacing(0, 1),
    position: 'sticky',
    top: 0
}));

const GridColumnHeaderCell = forwardRef<HTMLDivElement, BoxProps>(({ className, ...props }, ref) => (
    <StyledGridColumnHeaderCell
        ref={ref}
        className={clsx(gridClasses.cell, gridClasses.columnHeaderCell, className)}
        {...props}
    />
));
GridColumnHeaderCell.displayName = 'GridColumnHeaderCell';

export interface GridProps extends GuildViewProps, GuildRolesViewProps {
    permissions: bigint[];
}

export const Grid = ({ guild, roles, permissions, localization: { translations } }: GridProps) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

    const gridHeaderSectionRef = useRef<HTMLDivElement | null>(null);
    const gridHeaderRef = useRef<HTMLDivElement | null>(null);
    const gridBodyRef = useRef<HTMLDivElement | null>(null);
    const desktopRoleColumnHeaderRef = useRef<HTMLDivElement | null>(null);
    const mobileRoleColorIconColumnHeaderRef = useRef<HTMLDivElement | null>(null);
    const mobileRoleNameColumnHeaderRef = useRef<HTMLDivElement | null>(null);

    const [mainWidth, setMainWidth] = useState<number | undefined>(undefined);
    const [gridHeaderHeight, setGridHeaderHeight] = useState(0);
    const [desktopRoleColumnHeaderWidth, setDesktopRoleColumnHeaderWidth] = useState(0);
    const [mobileRoleColorIconColumnHeaderWidth, setMobileRoleColorIconColumnHeaderWidth] = useState(0);
    const [mobileRoleNameColumnHeaderWidth, setMobileRoleNameColumnHeaderWidth] = useState(0);
    const [mobileRoleNameColumnHeaderLeft, setMobileRoleNameColumnHeaderLeft] = useState(0);

    const handleGridBodyScroll = () => {
        const gridHeader = gridHeaderRef.current;
        const gridBody = gridBodyRef.current;
        if (!gridHeader || !gridBody)
            return;

        gridHeader.scrollTo({ left: gridBody.scrollLeft });
    };

    useLayoutEffect(() => {
        const handler = () => setMainWidth(() => {
            if (isMobile)
                return undefined;

            return Math.min((document.documentElement.clientWidth - ((8 * 7) + 280)) - ((8 * 3) * 2), 1200 - ((8 * 3) * 2));
        });

        handler();

        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [isMobile]);

    useLayoutEffect(() => {
        const gridHeaderSection = gridHeaderSectionRef.current;
        if (!gridHeaderSection)
            return;

        setGridHeaderHeight(() => {
            const gridHeaderSectionRect = gridHeaderSection.getBoundingClientRect();
            return gridHeaderSectionRect.height;
        });
    }, [mainWidth, gridHeaderSectionRef]);

    useLayoutEffect(() => {
        const desktopRoleColumnHeader = desktopRoleColumnHeaderRef.current;
        if (!desktopRoleColumnHeader)
            return;

        setDesktopRoleColumnHeaderWidth(() => {
            const desktopRoleColumnHeaderRect = desktopRoleColumnHeader.getBoundingClientRect();
            return desktopRoleColumnHeaderRect.width - 2;
        });
    }, [mainWidth, desktopRoleColumnHeaderRef]);

    useLayoutEffect(() => {
        const mobileRoleColorIconColumnHeader = mobileRoleColorIconColumnHeaderRef.current;
        const mobileRoleNameColumnHeader = mobileRoleNameColumnHeaderRef.current;

        if (!mobileRoleColorIconColumnHeader || !mobileRoleNameColumnHeader)
            return;

        const mobileRoleColorIconColumnHeaderRect = mobileRoleColorIconColumnHeader.getBoundingClientRect();
        const mobileRoleNameColumnHeaderRect = mobileRoleNameColumnHeader.getBoundingClientRect();

        setMobileRoleColorIconColumnHeaderWidth(() => mobileRoleColorIconColumnHeaderRect.width);
        setMobileRoleNameColumnHeaderWidth(() => mobileRoleNameColumnHeaderRect.width - 2);
        setMobileRoleNameColumnHeaderLeft(() => -((mobileRoleNameColumnHeaderRect.width - 2) - mobileRoleColorIconColumnHeaderRect.width));
    }, [mainWidth, mobileRoleColorIconColumnHeaderRef, mobileRoleNameColumnHeaderRef]);

    const everyoneRole = roles.find((role) => role.id === guild.id)!!;

    return (
        <Fragment>
            <Section
                ref={gridHeaderSectionRef}
                sx={(theme) => ({
                    // width: mainWidth,
                    position: 'sticky',
                    top: { xs: 56, sm: theme.spacing(8) },
                    zIndex: 3,
                    bgcolor: 'background.paper'
                })}
            >
                <SectionContent>
                    <GridRoot
                        ref={gridHeaderRef}
                        sx={{
                            overflow: 'hidden',
                            [`& .${gridClasses.column}`]: {
                                borderBottom: (theme) => `solid ${gridBorderWidth}px ${theme.palette.divider}`
                            }
                        }}
                    >
                        <DesktopGridColumnHeader>
                            <GridRowHeaderCell sx={{ width: desktopRoleColumnHeaderWidth }} />
                        </DesktopGridColumnHeader>
                        <MobileGridColumnHeader sx={{ borderRight: 'none' }}>
                            <GridRowHeaderCell sx={{ width: mobileRoleColorIconColumnHeaderWidth, minWidth: 0 }} />
                        </MobileGridColumnHeader>
                        <MobileGridColumnHeader
                            sx={{
                                position: mobileRoleNameColumnHeaderLeft < 0 ? 'sticky' : 'static',
                                left: mobileRoleNameColumnHeaderLeft,
                                zIndex: 1
                            }}
                        >
                            <GridRowHeaderCell sx={{ width: mobileRoleNameColumnHeaderWidth }} />
                        </MobileGridColumnHeader>
                        {permissions.map((permission) => (
                            <GridColumn key={permission.toString()}>
                                <GridColumnHeaderCell>
                                    <Typography>
                                        {translations[`permission_${permission}` as TranslationKeys]}
                                    </Typography>
                                </GridColumnHeaderCell>
                            </GridColumn>
                        ))}
                    </GridRoot>
                </SectionContent>
            </Section>
            <Section sx={{ /* width: mainWidth, */ mt: `${-(gridHeaderHeight)}px` }}>
                <SectionContent>
                    <GridRoot ref={gridBodyRef} onScroll={handleGridBodyScroll}>
                        <DesktopGridColumnHeader ref={desktopRoleColumnHeaderRef}>
                            <GridRowHeaderCell />
                            {roles.map((role) => (
                                <GridRowHeaderCell key={role.id}>
                                    <Box
                                        sx={{
                                            ...size(16),
                                            flexShrink: 0,
                                            bgcolor: getRoleColor(role),
                                            borderRadius: '50%'
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {role.name}
                                    </Typography>
                                </GridRowHeaderCell>
                            ))}
                        </DesktopGridColumnHeader>
                        <MobileGridColumnHeader
                            ref={mobileRoleColorIconColumnHeaderRef}
                            sx={{ borderRight: 'none' }}
                        >
                            <GridRowHeaderCell sx={{ minWidth: 0 }} />
                            {roles.map((role) => (
                                <GridRowHeaderCell
                                    key={role.id}
                                    sx={{ minWidth: 0, placeItems: 'center', placeContent: 'center' }}
                                >
                                    <Box sx={{ ...size(16), bgcolor: getRoleColor(role), borderRadius: '50%' }} />
                                </GridRowHeaderCell>
                            ))}
                        </MobileGridColumnHeader>
                        <MobileGridColumnHeader
                            ref={mobileRoleNameColumnHeaderRef}
                            sx={{
                                position: mobileRoleNameColumnHeaderLeft < 0 ? 'sticky' : 'static',
                                left: mobileRoleNameColumnHeaderLeft,
                                zIndex: 1
                            }}
                        >
                            <GridRowHeaderCell />
                            {roles.map((role) => (
                                <GridRowHeaderCell key={role.id}>
                                    <Typography>{role.name}</Typography>
                                </GridRowHeaderCell>
                            ))}
                        </MobileGridColumnHeader>
                        {permissions.map((permission) => (
                            <GridColumn key={permission.toString()}>
                                <GridColumnHeaderCell>
                                    <Typography sx={{ visibility: 'hidden' }}>
                                        {translations[`permission_${permission}` as TranslationKeys]}
                                    </Typography>
                                </GridColumnHeaderCell>
                                {roles.map((role) => {
                                    const isEveryoneRole = role.id === everyoneRole.id;
                                    const hasPermission = checkPermission(role.permissions, permission);
                                    const hasAdministratorPermission = checkPermission(role.permissions, PermissionFlagsBits.Administrator);
                                    const hasEveryonePermission = checkPermission(everyoneRole.permissions, permission);
                                    const hasEveryoneAdministratorPermission = checkPermission(everyoneRole.permissions, PermissionFlagsBits.Administrator);

                                    if (permission !== PermissionFlagsBits.Administrator && hasAdministratorPermission) {
                                        if (hasPermission) {
                                            return (
                                                <Tooltip
                                                    key={role.id}
                                                    title={translations.role_permissions_grid_deletable}
                                                    placement="top"
                                                    enterTouchDelay={100}
                                                >
                                                    <GridCell
                                                        sx={{
                                                            bgcolor: (theme) => alpha(theme.palette.warning.main, .1)
                                                        }}
                                                    >
                                                        <DeleteOutlined color="warning" />
                                                    </GridCell>
                                                </Tooltip>
                                            );
                                        } else {
                                            return (
                                                <Tooltip
                                                    key={role.id}
                                                    title={translations.role_permissions_grid_inherited_administrator}
                                                    placement="top"
                                                    enterTouchDelay={100}
                                                >
                                                    <GridCell
                                                        sx={{
                                                            bgcolor: (theme) => alpha(theme.palette.info.main, .1)
                                                        }}
                                                    >
                                                        <CrownOutlined color="info" />
                                                    </GridCell>
                                                </Tooltip>
                                            );
                                        }
                                    }

                                    if (!isEveryoneRole && (hasEveryonePermission || hasEveryoneAdministratorPermission)) {
                                        if (hasPermission) {
                                            return (
                                                <Tooltip
                                                    key={role.id}
                                                    title={translations.role_permissions_grid_deletable}
                                                    placement="top"
                                                    enterTouchDelay={100}
                                                >
                                                    <GridCell

                                                        sx={{
                                                            bgcolor: (theme) => alpha(theme.palette.warning.main, .1)
                                                        }}
                                                    >
                                                        <DeleteOutlined color="warning" />
                                                    </GridCell>
                                                </Tooltip>
                                            );
                                        } else {
                                            return (
                                                <Tooltip
                                                    key={role.id}
                                                    title={translations.role_permissions_grid_inherited_everyone}
                                                    placement="top"
                                                    enterTouchDelay={100}
                                                >
                                                    <GridCell
                                                        sx={{
                                                            bgcolor: (theme) => alpha(theme.palette.info.main, .1)
                                                        }}
                                                    >
                                                        <RemoveOutlined color="info" />
                                                    </GridCell>
                                                </Tooltip>
                                            );
                                        }
                                    }

                                    if (hasPermission) {
                                        return (
                                            <Tooltip
                                                key={role.id}
                                                title={translations.role_permissions_grid_yes}
                                                placement="top"
                                                enterTouchDelay={100}
                                            >
                                                <GridCell
                                                    sx={{
                                                        bgcolor: (theme) => alpha(theme.palette.primary.main, .1)
                                                    }}
                                                >
                                                    <CheckOutlined color="primary" />
                                                </GridCell>
                                            </Tooltip>
                                        );
                                    } else {
                                        return (
                                            <Tooltip
                                                key={role.id}
                                                title={translations.role_permissions_grid_no}
                                                placement="top"
                                                enterTouchDelay={100}
                                            >
                                                <GridCell>
                                                    <CloseOutlined color="disabled" />
                                                </GridCell>
                                            </Tooltip>
                                        );
                                    }
                                })}
                            </GridColumn>
                        ))}
                    </GridRoot>
                </SectionContent>
            </Section>
        </Fragment>
    );
};
