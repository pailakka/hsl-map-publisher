import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { JustifiedRow, CenteringColumn, Image } from "components/util";
import { getZoneName, iconsByMode } from "util/domain";

import styles from "./header.css";

const Group = props => (
    <div style={{ marginLeft: 15, marginRight: 15 }}>
        {props.children}
    </div>
);

Group.propTypes = {
    children: PropTypes.node.isRequired,
};

const Title = props => (
    <div className={classNames(styles.title, { [styles.small]: props.small })}>
        {props.children}
    </div>
);

Title.defaultProps = {
    small: false,
};

Title.propTypes = {
    children: PropTypes.string.isRequired,
    small: PropTypes.bool,
};

const Subtitle = props => (
    <div className={classNames(styles.subtitle, { [styles.small]: props.small })}>
        {props.children}
    </div>
);

Subtitle.defaultProps = {
    small: false,
};

Subtitle.propTypes = {
    children: PropTypes.string.isRequired,
    small: PropTypes.bool,
};

const Icon = props => (
    <Image {...props} style={{ height: 180, marginLeft: 0, marginRight: 10 }}/>
);

const Header = (props) => {
    const zone = getZoneName(props.shortId);
    return (
        <JustifiedRow style={{ margin: "0 10px" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
                {props.modes.map(mode => <Icon src={iconsByMode[mode]}/>)}
                <Group>
                    <Title>{props.nameFi}</Title>
                    <Subtitle>{props.nameSe}</Subtitle>
                </Group>
            </div>
            {zone &&
            <CenteringColumn>
                <Title small>Lippuvyöhyke</Title>
                <Subtitle small>Resezon</Subtitle>
                <div className={styles.zone}>{zone}</div>
            </CenteringColumn>
            }
            <CenteringColumn>
                <Title small>Pysäkkinumero</Title>
                <Subtitle small>Hållplatsnummer</Subtitle>
                <div className={styles.stop}>{props.shortId.replace(" ", "")}</div>
            </CenteringColumn>
        </JustifiedRow>
    );
};

Header.propTypes = {
    nameFi: PropTypes.string.isRequired,
    nameSe: PropTypes.string.isRequired,
    shortId: PropTypes.string.isRequired,
    modes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default Header;
